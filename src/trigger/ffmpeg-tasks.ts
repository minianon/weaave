import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "ffmpeg-static";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { promisify } from "util";

const execAsync = promisify(exec);

// Helper: Upload to Transloadit (Server-Side)
async function uploadToTransloaditServer(filePath: string, fileName: string, contentType: string): Promise<string> {
    const authKey = process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY;
    const templateId = process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID;

    if (!authKey || !templateId) {
        throw new Error("Transloadit configuration missing (NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY or TEMPLATE_ID)");
    }

    const fileBuffer = await fs.readFile(filePath);
    const formData = new FormData();

    formData.append("params", JSON.stringify({
        auth: { key: authKey },
        template_id: templateId,
    }));

    const blob = new Blob([fileBuffer], { type: contentType });
    formData.append("file", blob, fileName);

    console.log(`[Transloadit] Uploading ${fileName}...`);
    const response = await fetch("https://api2.transloadit.com/assemblies", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Transloadit API failed: ${response.status} ${text}`);
    }

    const result: any = await response.json();

    // Check for immediate result
    if (result.results && result.results[':original'] && result.results[':original'][0]) {
        return result.results[':original'][0].ssl_url;
    }

    // Check for uploads array
    if (result.uploads && result.uploads.length > 0) {
        return result.uploads[0].ssl_url;
    }

    // If assembly is executing, we might get an assembly_url but not the file yet.
    // For this assignment, we assume the template is synchronous enough or returns the upload URL immediately.
    // If not, we'd need to poll via assembly_url. 
    // Most simple store-only templates return immediately.
    if (result.assembly_url) {
        console.warn("[Transloadit] Assembly still executing. Returning assembly URL as fallback (might not be the file).");
        // We can't return the file URL if it's not ready. 
        // But throwing here blocks the flow.
        // Let's try to check 'uploads' again deeply.
    }

    console.error("[Transloadit] Unexpected response:", JSON.stringify(result).substring(0, 200));
    throw new Error("No URL returned from Transloadit assembly");
}

// FFmpeg Task: Crop Image
export const cropImageTask = task({
    id: "crop-image",
    run: async (payload: { imageUrl: string; x: number; y: number; width: number; height: number }) => {
        const { imageUrl, x, y, width, height } = payload;
        console.log(`[Crop Task] Starting for ${imageUrl}`);

        // 1. Download
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const tempDir = os.tmpdir();
        const inputPath = path.join(tempDir, `input-${Date.now()}.png`);
        const outputPath = path.join(tempDir, `output-${Date.now()}.png`);

        await fs.writeFile(inputPath, buffer);

        // 2. Crop
        // crop=iw*w_percent:ih*h_percent:iw*x_percent:ih*y_percent
        const cropFilter = `crop=iw*${width / 100}:ih*${height / 100}:iw*${x / 100}:ih*${y / 100}`;
        const ffmpegPath = ffmpeg || "ffmpeg";

        await execAsync(`"${ffmpegPath}" -y -i "${inputPath}" -vf "${cropFilter}" "${outputPath}"`);

        // 3. Upload
        try {
            const url = await uploadToTransloaditServer(outputPath, "cropped.png", "image/png");

            // Cleanup
            await fs.unlink(inputPath).catch(() => { });
            await fs.unlink(outputPath).catch(() => { });

            return { success: true, url };
        } catch (error) {
            console.error("[Crop Task] Upload failed:", error);
            // Cleanup
            await fs.unlink(inputPath).catch(() => { });
            await fs.unlink(outputPath).catch(() => { });
            throw error;
        }
    },
});

// FFmpeg Task: Extract Frame
export const extractFrameTask = task({
    id: "extract-frame",
    run: async (payload: { videoUrl: string; timestamp: number }) => {
        const { videoUrl, timestamp } = payload;
        console.log(`[Extract Task] Starting for ${videoUrl} at ${timestamp}s`);

        const tempDir = os.tmpdir();
        const outputPath = path.join(tempDir, `frame-${Date.now()}.jpg`);
        const ffmpegPath = ffmpeg || "ffmpeg";

        // 2. Extract - reads directly from URL if possible, usually yes for ffmpeg
        // -y to overwrite, -ss before -i for faster seeking
        await execAsync(`"${ffmpegPath}" -y -ss ${timestamp} -i "${videoUrl}" -frames:v 1 -q:v 2 "${outputPath}"`);

        // 3. Upload
        try {
            const url = await uploadToTransloaditServer(outputPath, "frame.jpg", "image/jpeg");

            await fs.unlink(outputPath).catch(() => { });
            return { success: true, url };
        } catch (error) {
            console.error("[Extract Task] Upload failed:", error);
            await fs.unlink(outputPath).catch(() => { });
            throw error;
        }
    },
});
