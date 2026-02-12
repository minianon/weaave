import { task } from "@trigger.dev/sdk/v3";
import { aiGenerator, cropImageTask, extractFrameTask } from "./workflow-nodes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Types ---
interface NodeData {
    id: string;
    type: string;
    data: any;
}

interface EdgeData {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

// Memory to store outputs of previous nodes
interface ExecutionContext {
    [nodeId: string]: {
        text?: string;
        imageUrls?: string[];
        videoUrl?: string;
    };
}

// --- Algorithm: Parallel Execution Layers ---
// Returns an array of arrays. Each inner array is a "layer" of nodes that can run in parallel.
function getExecutionLayers(nodes: NodeData[], edges: EdgeData[]): NodeData[][] {
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    // Init
    nodes.forEach((n) => {
        inDegree.set(n.id, 0);
        adj.set(n.id, []);
    });

    // Build Graph
    edges.forEach((edge) => {
        if (adj.has(edge.source) && adj.has(edge.target)) {
            adj.get(edge.source)!.push(edge.target);
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        }
    });

    const layers: NodeData[][] = [];
    let queue: string[] = [];

    // Find Layer 0 (Start Nodes)
    inDegree.forEach((degree, id) => {
        if (degree === 0) queue.push(id);
    });

    while (queue.length > 0) {
        const currentLayerIds = [...queue];
        queue = []; // Reset for next layer

        const currentLayerNodes = currentLayerIds
            .map(id => nodes.find(n => n.id === id))
            .filter((n): n is NodeData => !!n);

        layers.push(currentLayerNodes);

        // Process this layer to find the next layer
        for (const id of currentLayerIds) {
            const neighbors = adj.get(id) || [];
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }
    }

    return layers;
}

export const orchestrator = task({
    id: "workflow-orchestrator",
    run: async (payload: { runId: string }) => {
        // 1. Load Workflow
        const run = await prisma.workflowRun.findUnique({
            where: { id: payload.runId },
            include: { workflow: true },
        });
        if (!run) throw new Error("Run not found");

        const graph = run.workflow.data as any;
        const nodes: NodeData[] = graph.nodes || [];
        const edges: EdgeData[] = graph.edges || [];

        // 2. Plan Execution Layers
        const layers = getExecutionLayers(nodes, edges);

        console.log(`🚀 [Orchestrator] Starting Run: ${run.id}`);
        console.log(`📋 [Orchestrator] Layers: ${layers.length}`);

        // 3. Context (Memory)
        const context: ExecutionContext = {};

        // 4. Update Run Status
        await prisma.workflowRun.update({
            where: { id: run.id },
            data: { status: "RUNNING", startedAt: new Date() }
        });

        try {
            // 5. Execution Loop (Layer by Layer)
            for (const [index, layer] of layers.entries()) {
                console.log(`⚡ [Orchestrator] Executing Layer ${index + 1} with ${layer.length} nodes`);

                // Run all nodes in this layer PARALLEL
                await Promise.all(layer.map(async (node) => {
                    console.log(`  Running Node: ${node.type} (${node.id})`);

                    // --- A. PASSIVE NODES (Just Load Data) ---
                    if (node.type === "textNode") {
                        context[node.id] = { text: node.data.text };
                        return;
                    }

                    if (node.type === "imageNode") {
                        const url = node.data.file?.url || node.data.image;
                        if (url) context[node.id] = { imageUrls: [url] };
                        return;
                    }

                    if (node.type === "videoNode") {
                        const url = node.data.file?.url;
                        if (url) context[node.id] = { videoUrl: url };
                        return;
                    }

                    // --- B. ACTIVE NODES (Run Tasks) ---

                    // Create DB Record first
                    const executionRecord = await prisma.nodeExecution.create({
                        data: {
                            runId: run.id,
                            nodeId: node.id,
                            nodeType: node.type,
                            status: "RUNNING",
                            startedAt: new Date(),
                            inputData: node.data // Simplified input logging
                        }
                    });

                    try {
                        if (node.type === "llmNode") {
                            // Gather Inputs
                            const incomingEdges = edges.filter((e) => e.target === node.id);
                            let aggregatedText = "";
                            let aggregatedImages: string[] = [];

                            for (const edge of incomingEdges) {
                                const sourceData = context[edge.source];
                                if (!sourceData) continue;
                                if (sourceData.text) {
                                    if (edge.targetHandle === "system-prompt") {
                                        aggregatedText = `[System Context]: ${sourceData.text}\n\n` + aggregatedText;
                                    } else {
                                        aggregatedText += `\n[Context]: ${sourceData.text}`;
                                    }
                                }
                                if (sourceData.imageUrls) aggregatedImages.push(...sourceData.imageUrls);
                            }

                            const result = await aiGenerator.triggerAndWait({
                                prompt: node.data.prompt || "Analyze this.",
                                systemPrompt: aggregatedText,
                                imageUrls: aggregatedImages,
                                model: node.data.model || "gemini-1.5-flash",
                                temperature: node.data.temperature
                            });

                            if (result.ok) {
                                context[node.id] = { text: result.output.text };
                                await prisma.nodeExecution.update({
                                    where: { id: executionRecord.id },
                                    data: { status: "SUCCESS", finishedAt: new Date(), outputData: result.output as any }
                                });
                            } else {
                                throw new Error(`Task failed: ${result.error}`);
                            }
                        }

                        else if (node.type === "cropImageNode") {
                            const incomingEdges = edges.filter((e) => e.target === node.id);
                            let inputImageUrl = node.data.imageUrl;

                            // Resolve input from previous node
                            for (const edge of incomingEdges) {
                                const sourceData = context[edge.source];
                                if (sourceData?.imageUrls?.[0]) {
                                    inputImageUrl = sourceData.imageUrls[0];
                                    break;
                                }
                            }

                            if (!inputImageUrl) throw new Error("No input image");

                            const result = await cropImageTask.triggerAndWait({
                                imageUrl: inputImageUrl,
                                x: node.data.xPercent || 0,
                                y: node.data.yPercent || 0,
                                width: node.data.widthPercent || 100,
                                height: node.data.heightPercent || 100
                            });

                            if (result.ok) {
                                context[node.id] = { imageUrls: [result.output.url] };
                                await prisma.nodeExecution.update({
                                    where: { id: executionRecord.id },
                                    data: { status: "SUCCESS", finishedAt: new Date(), outputData: result.output as any }
                                });
                            } else {
                                throw new Error(result.error);
                            }
                        }

                        else if (node.type === "extractFrameNode") {
                            const incomingEdges = edges.filter((e) => e.target === node.id);
                            let inputVideoUrl = node.data.videoUrl;

                            for (const edge of incomingEdges) {
                                const sourceData = context[edge.source];
                                if (sourceData?.videoUrl) {
                                    inputVideoUrl = sourceData.videoUrl;
                                    break;
                                }
                            }

                            if (!inputVideoUrl) throw new Error("No input video");

                            const result = await extractFrameTask.triggerAndWait({
                                videoUrl: inputVideoUrl,
                                timestamp: node.data.timestamp || 0
                            });

                            if (result.ok) {
                                context[node.id] = { imageUrls: [result.output.url] };
                                await prisma.nodeExecution.update({
                                    where: { id: executionRecord.id },
                                    data: { status: "SUCCESS", finishedAt: new Date(), outputData: result.output as any }
                                });
                            } else {
                                throw new Error(result.error);
                            }
                        }

                    } catch (error) {
                        console.error(`❌ Node ${node.id} Failed:`, error);
                        await prisma.nodeExecution.update({
                            where: { id: executionRecord.id },
                            data: { status: "FAILED", finishedAt: new Date(), error: String(error) }
                        });
                        throw error; // Fail the whole layer/run
                    }
                }));
            }

            // 6. Complete Run
            await prisma.workflowRun.update({
                where: { id: run.id },
                data: { status: "COMPLETED", finishedAt: new Date() }
            });

        } catch (error) {
            console.error("Workflow Run Warning/Error:", error);
            await prisma.workflowRun.update({
                where: { id: run.id },
                data: { status: "FAILED", finishedAt: new Date() }
            });
            throw error;
        }

        return { success: true };
    },
});