import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language }: { code?: string; language?: string } = body;

    if (typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid "code" field. Provide non-empty string.' },
        { status: 400 }
      );
    }

    if (typeof language !== "string" || language.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid "language" field. Provide non-empty string.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a code explainer. Summarize what the code does, list errors (❌), and suggest improvements (💡).`;

    const userPrompt = `Language: ${language}

Code:
${code}

Please explain this code in detail.`;

    const response = await ollama.chat({
      model: "codellama",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      options: {
        temperature: 0.3,
        top_p: 0.9,
        num_ctx: 4096,
      },
    });

    const explanation = response?.message?.content ?? "No explanation available.";

    return NextResponse.json({ explanation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to generate explanation", details: message },
      { status: 500 }
    );
  }
}
