import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AudioLines, Mic2, Radio, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";

import { generatePodcast } from "@/lib/podcast.functions";

export const Route = createFileRoute("/")({
  component: PodcastGenerator,
  head: () => ({
    meta: [
      { title: "Podscript AI | Podcast Generator" },
      { name: "description", content: "Turn any topic into a polished AI-generated podcast with Podscript AI." },
      { property: "og:title", content: "Podscript AI | Podcast Generator" },
      { property: "og:description", content: "Turn any topic into a polished AI-generated podcast with Podscript AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function LoadingDots() {
  return (
    <div className="loading-dots flex items-center justify-center gap-2" aria-label="Generating podcast">
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span className="h-2 w-2 rounded-full bg-primary" />
    </div>
  );
}

const waveform = [28, 48, 72, 42, 88, 60, 34, 76, 52, 96, 66, 40, 82, 54, 30, 64, 44, 78, 56, 36, 68, 46, 86, 58];

function Waveform({ active }: { active: boolean }) {
  return (
    <div className={`waveform ${active ? "waveform-active" : ""}`} aria-hidden>
      {waveform.map((height, index) => (
        <span key={`${height}-${index}`} className="waveform-bar" style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function PodcastGenerator() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePodcastFn = useServerFn(generatePodcast);

  const handleGenerate = async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setAudioFile(null);
    setError(null);

    try {
      const result = await generatePodcastFn({ data: { topic: topic.trim() } });
      if (result.audioFile) {
        setAudioFile(result.audioFile);
        setTopic("");
      } else {
        setError(result.error || "Oops! Something went wrong. Please try again");
      }
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "";
      setError(message || "Oops! Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="studio-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-border py-5">
          <div className="flex items-center gap-3">
            <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-foreground">Podscript AI</p>
              <p className="text-xs text-muted-foreground">Intelligent audio studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <span className="status-dot h-2 w-2 rounded-full bg-primary" />
            Studio online
          </div>
        </header>

        <section className="grid flex-1 items-stretch lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)]">
          <div className="flex flex-col justify-center border-border py-10 lg:border-r lg:py-16 lg:pr-14">
            <div className="mb-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase text-primary">
                <Sparkles className="h-4 w-4" />
                Generative audio workspace
              </div>
              <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Turn your next idea into a podcast.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Enter a topic and let AI shape the narrative, voice, and sound into a ready-to-play episode.
              </p>
            </div>

            <div className="max-w-2xl">
              <label htmlFor="topic" className="mb-3 block text-sm font-semibold text-foreground">
                What should we talk about?
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Type podcast topic here..."
                rows={6}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-input bg-card p-5 text-base leading-7 text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Be specific for a richer episode</span>
                <span>{topic.length}/500</span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="generate-button mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <LoadingDots /> : <Volume2 className="h-5 w-5" />}
                <span>{isLoading ? "Creating podcast..." : "Generate Podcast"}</span>
              </button>
            </div>
          </div>

          <aside className="flex min-h-[520px] flex-col justify-between py-10 lg:py-16 lg:pl-14" aria-live="polite">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase text-muted-foreground">Live preview</h2>
              </div>
              <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                AI audio
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className={`visualizer-orbit ${isLoading ? "is-generating" : ""} mb-10 flex h-44 w-44 items-center justify-center rounded-full border border-border`}>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-primary">
                  {isLoading ? <Sparkles className="h-9 w-9" /> : <AudioLines className="h-10 w-10" />}
                </div>
              </div>
              <Waveform active={isLoading || Boolean(audioFile)} />

              <div className="mt-9 min-h-24 w-full">
                {isLoading ? (
                  <div className="space-y-3">
                    <LoadingDots />
                    <h3 className="font-heading text-lg font-semibold text-foreground">Creating your podcast</h3>
                    <p className="text-sm text-muted-foreground">Writing, voicing, and mastering... please wait!</p>
                  </div>
                ) : error ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
                    <h3 className="font-heading font-semibold text-destructive">Generation paused</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                  </div>
                ) : audioFile ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">🎉 Podcast is ready!</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Click play to listen</p>
                    </div>
                    <audio controls src={audioFile} className="audio-player w-full">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">Your episode starts here</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Podcast will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Output quality</span>
                <span className="font-semibold text-foreground">Studio · High fidelity</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
