import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: PodcastGenerator,
  head: () => ({
    meta: [
      { title: "Podcast Generator" },
      { name: "description", content: "Generate a cute podcast from any topic in seconds." },
      { property: "og:title", content: "Podcast Generator" },
      { property: "og:description", content: "Generate a cute podcast from any topic in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Generating podcast">
      <span
        className="h-3 w-3 rounded-full bg-primary"
        style={{ animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: "0ms" }}
      />
      <span
        className="h-3 w-3 rounded-full bg-primary"
        style={{ animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: "150ms" }}
      />
      <span
        className="h-3 w-3 rounded-full bg-primary"
        style={{ animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: "300ms" }}
      />
    </div>
  );
}

function PodcastGenerator() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setHasGenerated(false);

    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2.5rem] bg-card p-8 shadow-xl shadow-foreground/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-secondary p-4">
            <span className="text-4xl" aria-hidden>
              🎙️
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Podcast Generator
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Type a topic and we’ll create a cute podcast just for you.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="sr-only">
              Podcast topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Type podcast topic here..."
              className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
          >
            <span aria-hidden>🔊</span>
            Generate Podcast
          </button>
        </div>

        <div
          className="mt-8 flex min-h-40 flex-col items-center justify-center rounded-3xl bg-secondary p-6 text-center transition-all"
          aria-live="polite"
        >
          {isGenerating ? (
            <div className="space-y-3">
              <LoadingDots />
              <p className="text-sm font-medium text-secondary-foreground">Generating your podcast...</p>
            </div>
          ) : hasGenerated ? (
            <div className="space-y-2">
              <span className="text-3xl" aria-hidden>
                🎧
              </span>
              <p className="text-base font-semibold text-secondary-foreground">
                Feature coming soon!
              </p>
              <p className="text-sm text-muted-foreground">
                We’re still teaching the studio how to record.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-3xl" aria-hidden>
                🎵
              </span>
              <p className="text-base font-medium text-muted-foreground">
                Podcast will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
