# Weaave: Visual AI Workflow Builder

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-12-purple)
![Trigger.dev](https://img.shields.io/badge/Trigger.dev-Enabled-green)

![Weaave](https://github.com/user-attachments/assets/0b02ef9d-c5d8-430d-a598-fc1e88cc3a9b)

Design and run LLM-powered workflows on a visual canvas. Connect text, image, video, and AI nodes, and Weaave executes them in the background, running independent branches in parallel.

**[Live app](https://weaave.minianon.in)**

---

## Features

- **Visual workflow canvas**: drag and drop, panning, zooming, and minimap (React Flow)
- **6 node types**: Text, Image Upload, Video Upload, LLM, Crop Image, Extract Frame
- **AI execution**: Google Gemini with vision support
- **Background processing**: every node runs as a Trigger.dev task, with no client-side API calls
- **Parallel execution**: independent branches run concurrently
- **Media processing**: cloud FFmpeg on Trigger.dev for cropping and frame extraction
- **Smart timestamps**: extract frames by seconds or percentage (e.g. "50%")
- **Robust execution**: strict failure propagation and error handling
- **Workflow history**: full run history with node-level details
- **Real-time status**: running nodes glow while they execute
- **File uploads**: secure, scalable uploads via Transloadit
- **Auth & persistence**: Clerk authentication, PostgreSQL with Prisma

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, React Flow, Tailwind CSS |
| State | Zustand |
| Database | PostgreSQL + Prisma |
| Auth | Clerk |
| AI | Google Gemini API |
| Background Jobs | Trigger.dev |
| Validation | Zod |

## Architecture

| Document | Description |
|----------|-------------|
| [High-Level Design](docs/HLD.md) | System architecture, components, and data flow |
| [Low-Level Design](docs/LLD.md) | Database schema, API endpoints, and execution flow |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com))
- [Clerk](https://clerk.com) account
- [Google AI Studio](https://aistudio.google.com) API key
- [Trigger.dev](https://trigger.dev) account

### Installation

```bash
git clone https://github.com/minianon/weaave.git
cd weaave

npm install

cp .env.example .env
# Fill in your API keys (see .env.example)

npx prisma db push
npm run dev

# In a separate terminal
npm run trigger:dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](.env.example) for setup details.

| Variable | Description | Get it from |
|----------|-------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | [Neon](https://neon.tech) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | [Clerk](https://clerk.com) |
| `CLERK_SECRET_KEY` | Clerk secret key | [Clerk](https://clerk.com) |
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com) |
| `TRIGGER_SECRET_KEY` | Trigger.dev secret key | [Trigger.dev](https://trigger.dev) |
| `NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY` | Transloadit auth key | [Transloadit](https://transloadit.com) |
| `NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID` | Transloadit template ID | [Transloadit](https://transloadit.com) |

## Project Structure

```
src/
├── app/            # Next.js App Router pages
├── components/
│   └── workflow/   # Workflow canvas & nodes
├── lib/            # Utilities & types
├── store/          # Zustand state
├── trigger/        # Trigger.dev background tasks
└── prisma/         # Database schema
```

## License

MIT. See [LICENSE](LICENSE).

---

Built by [Tushar Bhardwaj](https://minianon.in)
