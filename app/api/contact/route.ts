import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
}

/**
 * Placeholder contact endpoint.
 *
 * Per spec section 17, email sending is NOT implemented until
 * credentials (e.g. RESEND_API_KEY / SMTP config) are available. This
 * validates the payload and returns a clear success response so the
 * UI works end-to-end; wire up real delivery here later.
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }

  // TODO: send email / write to database once credentials are configured.
  console.log("[contact form submission]", body);

  return NextResponse.json({ ok: true });
}
