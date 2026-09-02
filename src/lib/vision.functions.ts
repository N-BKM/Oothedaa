import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { OBJECT_DATA, type ObjectKey } from "./calculator";

const Input = z.object({
  imageDataUrl: z.string().min(32).max(9_000_000),
});

const CATEGORIES = Object.keys(OBJECT_DATA) as ObjectKey[];

export interface VisionResult {
  ok: boolean;
  object?: ObjectKey;
  confidence?: number;
  reason?: string;
}

export const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<VisionResult> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false, reason: "AI is not configured." };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3.6-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "Identify the main inflatable object in this image. Return only the most likely category from this list: bicycle tyre, motorcycle tyre, car tyre, truck tyre, football, basketball, volleyball, balloon, inflatable toy, other. Also provide a confidence estimate from 0 to 100. Do not hallucinate detailed physical dimensions. Reply with strict JSON only: {\"category\": \"...\", \"confidence\": 0-100}",
                },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        return {
          ok: false,
          reason:
            res.status === 429
              ? "Too many requests — our AI needs a breather."
              : res.status === 402
                ? "AI credits exhausted. Add credits to keep suffering."
                : `AI request failed (${res.status}). ${body.slice(0, 120)}`,
        };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = json.choices?.[0]?.message?.content ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return { ok: false, reason: "The AI replied in gibberish." };
      const parsed = JSON.parse(match[0]) as { category?: string; confidence?: number };
      const cat = String(parsed.category ?? "").toLowerCase().trim() as ObjectKey;
      if (!CATEGORIES.includes(cat)) return { ok: false, reason: "unknown-object" };
      const confidence = Math.max(1, Math.min(100, Math.round(Number(parsed.confidence) || 70)));
      return { ok: true, object: cat, confidence };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : "Unknown AI failure." };
    }
  });
