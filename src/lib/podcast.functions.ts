import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const generatePodcastInputSchema = z.object({
  topic: z.string().min(1).max(500),
});

const generatePodcastOutputSchema = z.object({
  audioFile: z.string().min(1),
});

export const generatePodcast = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generatePodcastInputSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl =
      process.env["N8N_WEBHOOK_URL"] ??
      "https://hasan1.app.n8n.cloud/webhook-test/5546ab25-4fef-42ef-b477-1d9d96cfbbf4";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: data.topic }),
    });

    if (!response.ok) {
      throw new Error(`Podcast service returned ${response.status}`);
    }

    const raw = await response.json();
    const output = generatePodcastOutputSchema.parse(raw);
    return output;
  });
