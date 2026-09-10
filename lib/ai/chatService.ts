import { getAllPlans } from "@/lib/database/plans";
import { SCORING_WEIGHTS } from "@/lib/comparison/weights";
import { GUIDE_TOPICS } from "@/data/demo-plans/guides";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  reply: string;
  source: "ai" | "mock";
}

const MAX_HISTORY = 10;

/**
 * Builds a compact, structured summary of the live app data so the
 * assistant answers using real information rather than guessing.
 * Kept intentionally short to control token usage.
 */
async function buildSystemPrompt(): Promise<string> {
  const plans = await getAllPlans();

  const planSummary = plans
    .map(
      (p) =>
        `- ${p.provider} "${p.planName}": $${p.ongoingPrice}/mo ongoing, ${p.downloadSpeed}/${p.uploadSpeed} Mbps, ${p.contractType}, best for: ${p.suitableFor.join(", ")}${p.isDemoData ? " [DEMO DATA]" : ""}`
    )
    .join("\n");

  const weightsSummary = Object.entries(SCORING_WEIGHTS)
    .map(([k, v]) => `${k}: ${Math.round(v * 100)}%`)
    .join(", ");

  return `You are the help assistant embedded on Compare NBN, an independent Australian NBN plan comparison website.

Your job: answer questions about how the website works, help people decide which comparison path to use, and explain plan comparisons — using ONLY the structured data below. Never invent prices, speeds, contract terms or provider claims that aren't in this data.

ABOUT THE SITE:
- Independent comparison platform. Providers CANNOT pay for a better ranking.
- Two ways to compare plans:
  1. "Search by Speed" (/compare/by-speed) — for people who already know the exact NBN speed they want (25/50/100/250/500/1000 Mbps).
  2. The questionnaire (/compare) — for people who aren't sure, answering a few questions about household size, usage, devices and budget.
- Scoring model weights: ${weightsSummary}. Full detail at /methodology.
- AI never invents plan facts — it only explains structured comparison data.
- All current plan data is DEMO DATA for development — clearly labelled, not real commercial offers yet.
- Guides available at /guides: ${GUIDE_TOPICS.join("; ")}.
- Legal/info pages: /how-it-works, /methodology, /about, /privacy, /terms, /disclaimer, /contact.

CURRENT DEMO PLANS IN THE DATABASE:
${planSummary}

STYLE:
- Be concise, warm and plain-English. Prefer 2-4 short sentences or a short list.
- If asked something not covered by this data, say so honestly and suggest where on the site they could find out (e.g. "check the plan page" or "try our Search by Speed tool").
- If someone wants a personalised recommendation, direct them to /compare or /compare/by-speed rather than guessing yourself.
- Never claim a plan is "the best" outright — describe it in terms of the comparison categories (best value, cheapest suitable, etc.) per the site's methodology.
- Remind people (briefly, only if relevant) that plan details should be confirmed with the provider before signing up.`;
}

function buildMockReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  const rules: { keywords: string[]; reply: string }[] = [
    {
      keywords: ["hello", "hi", "hey"],
      reply:
        "Hi! I can help you understand how Compare NBN works, or point you toward the right comparison tool. What would you like to know?",
    },
    {
      keywords: ["speed", "mbps", "fast", "download"],
      reply:
        "If you already know the speed you want, use \"Search by Speed\" on the /compare page — pick a tier (25/50/100/250/500/1000 Mbps) and see matching plans instantly. Not sure? The questionnaire on /compare will work it out from your household and usage.",
    },
    {
      keywords: ["cheap", "cheapest", "price", "cost", "budget"],
      reply:
        "After you compare plans, look for the \"Cheapest Suitable\" category on your results page — it's the lowest-cost plan that still meets what you told us. You can also set a budget range directly in the questionnaire.",
    },
    {
      keywords: ["score", "rank", "ranking", "methodology", "algorithm"],
      reply:
        "Plans are scored out of 100 using a transparent, published formula — price, download speed, upload speed, suitability, contract flexibility and features, each weighted. Providers can't pay for a better score. Full breakdown is on the /methodology page.",
    },
    {
      keywords: ["demo", "real", "fake", "not real"],
      reply:
        "Good question — every plan currently in our database is clearly labelled demo data, used for building and testing the comparison tool. Nothing here is available for purchase yet.",
    },
    {
      keywords: ["contract", "lock-in", "lock in"],
      reply:
        "Most demo plans in our database are no lock-in contracts, which score highest on our flexibility factor. Check each plan's detail page for its exact contract terms.",
    },
    {
      keywords: ["gaming", "game"],
      reply:
        "For gaming, look at the \"Best for Gaming\" category on your comparison results — it favours plans with strong upload speed and consistency, which matters more for gaming than download speed alone.",
    },
    {
      keywords: ["family", "families", "household"],
      reply:
        "For larger households, the \"Best for Families\" category highlights plans built for multiple devices and simultaneous streaming. The questionnaire also asks how many people and devices you have to fine-tune this.",
    },
    {
      keywords: ["ai", "artificial intelligence", "chatgpt"],
      reply:
        "AI on this site (including me) only explains and personalises results using our structured plan data — it never invents prices, speeds or features. See /methodology for how that works.",
    },
    {
      keywords: ["contact", "human", "support", "help me", "real person"],
      reply:
        "For anything I can't help with, use the contact form at /contact — you can flag a question, a data correction, or general feedback.",
    },
    {
      keywords: ["afford", "provider", "sponsor", "paid", "affiliate"],
      reply:
        "We don't run paid or sponsored rankings — providers can't pay for a better position. You can read our full independence policy on the /methodology page.",
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => msg.includes(k))) {
      return rule.reply;
    }
  }

  return "I'm not able to answer that with certainty from what's on this site. Try browsing to Compare NBN (/compare) to answer a few questions, or Search by Speed (/compare/by-speed) if you already know the speed you want — or check the Methodology and How It Works pages for more detail.";
}

export async function getChatReply(history: ChatMessage[]): Promise<ChatReply> {
  const trimmedHistory = history.slice(-MAX_HISTORY);
  const lastUserMessage =
    [...trimmedHistory].reverse().find((m) => m.role === "user")?.content ?? "";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { reply: buildMockReply(lastUserMessage), source: "mock" };
  }

  try {
    const systemPrompt = await buildSystemPrompt();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);

    const data = await response.json();
    const reply: string =
      data.choices?.[0]?.message?.content?.trim() || buildMockReply(lastUserMessage);

    return { reply, source: "ai" };
  } catch {
    // The chatbot must never hard-fail the page — fall back to the mock.
    return { reply: buildMockReply(lastUserMessage), source: "mock" };
  }
}
