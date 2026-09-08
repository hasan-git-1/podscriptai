import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const generatePodcastInputSchema = z.object({
  topic: z.string().min(1).max(500),
});

function findAudioUrl(value: unknown, depth = 0): string | null {
  if (depth > 6 || value == null) return null;
  if (typeof value === "string") {
    return /^(https?:\/\/|data:audio)/i.test(value.trim()) ? value.trim() : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAudioUrl(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const preferred = ["audioFile", "audio_file", "audioUrl", "audio_url", "audio", "url", "link", "fileUrl"];
    for (const key of preferred) {
      const found = findAudioUrl(obj[key], depth + 1);
      if (found) return found;
    }
    for (const v of Object.values(obj)) {
      const found = findAudioUrl(v, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

export const generatePodcast = createServerFn({ method: "POST" })
  .validator((input: unknown) => generatePodcastInputSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl =
      process.env["N8N_WEBHOOK_URL"] ??
      "https://hasan1.app.n8n.cloud/webhook-test/5546ab25-4fef-42ef-b477-1d9d96cfbbf4";

    // Try the configured URL, then the sibling test/production variant.
    const candidates = [webhookUrl];
    if (webhookUrl.includes("/webhook-test/")) {
      candidates.push(webhookUrl.replace("/webhook-test/", "/webhook/"));
    } else if (webhookUrl.includes("/webhook/")) {
      candidates.push(webhookUrl.replace("/webhook/", "/webhook-test/"));
    }

    let lastStatus = 0;
    let lastText = "";

    for (const url of candidates) {
      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: data.topic }),
        });
      } catch (error) {
        console.error("Podcast webhook request failed", url, error);
        continue;
      }

      const text = await response.text();
      lastStatus = response.status;
      lastText = text;

      if (!response.ok) {
        console.error("Podcast webhook error", url, response.status, text.slice(0, 500));
        continue;
      }

      let raw: unknown = null;
      try {
        raw = JSON.parse(text);
      } catch {
        raw = text;
      }

      const audioFile = findAudioUrl(raw);
      if (!audioFile) {
        console.error("Podcast webhook returned no audio link", url, text.slice(0, 500));
        return { audioFile: null, error: "The podcast service did not return an audio link." };
      }

      return { audioFile, error: null };
    }

    if (lastStatus === 404 && lastText.includes("not registered")) {
      return {
        audioFile: null,
        error:
          "The podcast workflow isn't listening right now. Activate it (or click Execute workflow for the test link) and try again.",
      };
    }

    return {
      audioFile: null,
      error: lastStatus
        ? `Podcast service returned ${lastStatus}. Please try again.`
        : "Oops! Something went wrong. Please try again",
    };
  });


