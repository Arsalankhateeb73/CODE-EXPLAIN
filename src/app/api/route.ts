import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code: string | undefined = body?.code;
    if (typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid "code" field. Provide non-empty string.' },
        { status: 400 }
      );
    }

    const response = await ollama.chat({
      model: "codellama:latest",
      messages: [
        { role: "system", content: "You are a code explainer." },
        { role: "user", content: `Explain this code:\n\n${code}` },
      ],
      options: {
        temperature: 0.2,
        top_p: 0.9,
        num_ctx: 4096,
      },
    });

    const explanation = response?.message?.content ?? "";
    return NextResponse.json({ explanation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to generate explanation", details: message },
      { status: 500 }
    );
  }
}