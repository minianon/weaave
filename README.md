# Weave - Visual AI Workflow Builder

A pixel-perfect clone of [Weavy.ai](https://weavy.ai) — a visual workflow builder for LLM-powered automations. Built with React Flow, Google Gemini AI, and Trigger.dev.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-12-purple)
![Trigger.dev](https://img.shields.io/badge/Trigger.dev-Enabled-green)

## Features

- **Visual Workflow Canvas** — React Flow with drag & drop, panning, zooming, and minimap
- **6 Node Types** — Text, Image Upload, Video Upload, LLM, Crop Image, Extract Frame
- **AI-Powered Execution** — Google Gemini API with vision support
- **Background Processing** — All node executions via Trigger.dev tasks
- **Workflow History** — Full execution history with node-level details
- **Real-time Status** — Pulsating glow effect on running nodes
- **Parallel Execution** — Independent branches run concurrently
- **Authentication** — Clerk-powered user authentication
- **Data Persistence** — PostgreSQL with Prisma ORM

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19, React Flow |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | PostgreSQL + Prisma |
| Auth | Clerk |
| AI | Google Gemini API |
| Background Jobs | Trigger.dev |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com))
- [Clerk](https://clerk.com) account
- [Google AI Studio](https://aistudio.google.com) API key
- [Trigger.dev](https://trigger.dev) account

### Installation

```bash
# Clone the repository
git clone https://github.com/TuShArBhArDwA/weavy-clone.git
cd weavy-clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys in .env

# Push database schema
npx prisma db push

# Run development server
npm run dev

# (In a separate terminal) Run Trigger.dev
npm run trigger:dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `TRIGGER_SECRET_KEY` | Trigger.dev secret key |

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   └── workflow/        # Workflow canvas & nodes
├── lib/                 # Utilities & types
├── store/               # Zustand state management
├── trigger/             # Trigger.dev background tasks
└── prisma/              # Database schema
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Connect with me

If you’d like to connect, feel free to reach out — [Click here](https://minianonlink.vercel.app/tusharbhardwaj)
