import { NextResponse } from "next/server";
import { getChatReply, type ChatMessage } from "@/lib/ai/chatService";

interface ChatRequestBody {
  messages?: unknown;
}

function isValidMessages(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0 &&
        m.content.length <= 2000
    )
  );
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidMessages(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array of { role, content }" },
      { status: 400 }
    );
  }

  if (body.messages.length > 20) {
    return NextResponse.json(
      { error: "Too many messages in this conversation." },
      { status: 400 }
    );
  }

  try {
    const result = await getChatReply(body.messages);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}
