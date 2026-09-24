# Podscript AI

Turn a written topic into a ready-to-play AI podcast through a focused, modern audio workspace.

[Live Demo](https://podscriptai.lovable.app) · [Report an Issue](https://github.com/hasan-git-1/tubiq/issues)

## Overview

Podscript AI accepts a podcast topic, sends it to an n8n generation workflow, and presents the returned audio in a built-in player. The interface provides clear loading, success, and error states while remaining responsive across desktop and mobile screens.

## Features

- Topic-to-podcast generation
- n8n webhook integration
- Flexible parsing of nested audio URL responses
- Built-in HTML audio player
- Animated generation and waveform feedback
- Clear recovery messages when the workflow is unavailable
- Responsive, accessible interface
- Reduced-motion support
- Server-side webhook requests

## Tech Stack

- [React 19](https://react.dev/)
- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [Zod](https://zod.dev/)
- [Lucide React](https://lucide.dev/)
- [n8n](https://n8n.io/)

## How It Works

1. The user enters a podcast topic.
2. The app sends a server-side `POST` request containing `{ "topic": "..." }` to the configured n8n webhook.
3. The workflow generates the episode and returns an audio URL.
4. Podscript AI finds the URL in the response and loads it into the audio player.

The response parser supports common fields including `audioFile`, `audioUrl`, `audio`, `url`, `link`, and `fileUrl`, including nested response objects.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.1 or newer
- An active n8n workflow that returns a public audio URL

### Installation

```bash
git clone https://github.com/hasan-git-1/tubiq.git
cd tubiq
bun install
```

### Environment Configuration

Create a `.env.local` file in the project root:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.example/webhook/your-webhook-id
```

Use an active production `/webhook/` URL for regular use. An n8n `/webhook-test/` URL only works temporarily after selecting **Execute workflow** in n8n.

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If the terminal displays a different local address, use that address instead.

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Create a production build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Check the codebase with ESLint |
| `bun run format` | Format the codebase with Prettier |

## Expected Webhook Response

The recommended response format is:

```json
{
  "audioFile": "https://example.com/generated-podcast.mp3"
}
```

The audio URL must be reachable by the listener's browser. Podscript AI also accepts supported audio URLs nested inside arrays or objects.

## Project Structure

```text
src/
├── components/ui/          Reusable interface components
├── lib/
│   └── podcast.functions.ts  Podcast webhook integration
├── routes/
│   ├── __root.tsx          Shared document layout
│   └── index.tsx           Podcast studio screen
└── styles.css              Design tokens and animations
```

## Deployment

Build the project with `bun run build` and deploy the generated application to any platform that supports TanStack Start. Add `N8N_WEBHOOK_URL` to the hosting provider's server-side environment variables.

For Lovable deployments, connect this repository through **GitHub → Connect project**. Changes made in Lovable and GitHub then stay synchronized automatically.

## Troubleshooting

### The workflow is not listening

- Activate the n8n workflow when using a production `/webhook/` URL.
- Select **Execute workflow** immediately before testing a `/webhook-test/` URL.
- Confirm that `N8N_WEBHOOK_URL` contains the correct workflow ID.

### No audio link is returned

- Confirm the final n8n node returns a public HTTP(S) audio URL.
- Prefer the documented `{ "audioFile": "..." }` response format.
- Ensure the generated file has not expired and allows browser playback.

## Contributing

Contributions are welcome. Open an issue to discuss substantial changes, then submit a focused pull request with a clear description and testing notes.

---

Built with [Lovable](https://lovable.dev/) by [MD Hasan](https://github.com/hasan-git-1).