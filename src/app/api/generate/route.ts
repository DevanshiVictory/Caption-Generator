export const runtime = "nodejs";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Missing API key. Set OPENROUTER_API_KEY or OPENAI_API_KEY in your environment.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const { topic, tone, platform } = body;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: `
You are a world-class viral content strategist.

Generate 5 ${platform} captions about:

"${topic}"

The tone should feel:
${tone}

Caption writing rules:

- Start with a strong hook
- Make captions emotionally engaging
- Avoid robotic AI wording
- Use modern internet language naturally
- Optimize for engagement and shares
- Use short punchy lines when needed
- Include curiosity gaps
- Add emojis only where relevant
- Include platform-specific style
- Include highly relevant hashtags
- Every caption should feel different

If tone is "genz":
- use trendy internet slang naturally
- lowercase styling occasionally
- make it relatable

If tone is "luxury":
- make it elegant and minimal

If tone is "viral":
- maximize hook strength and curiosity

Output format:

Caption 1:
[text]

Hashtags:
[text]

Caption 2:
[text]

Hashtags:
[text]
`,
        },
      ],
    });

    const caption = completion.choices?.[0]?.message?.content?.trim();

    if (!caption) {
      return NextResponse.json(
        {
          error: "The AI response did not include any caption text.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: caption,
    });
  } catch (error: any) {
    console.log("OPENROUTER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}