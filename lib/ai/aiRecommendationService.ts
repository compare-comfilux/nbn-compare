import type { AiRecommendationInput, AiRecommendationOutput } from "@/types";

/**
 * AI recommendation service.
 *
 * IMPORTANT: this service must never invent factual plan information
 * (prices, speeds, contracts, features, availability, discounts). It
 * only ever explains/personalises what the comparison engine already
 * calculated from structured data. If OPENAI_API_KEY is not set, or
 * the API call fails for any reason, we fall back to a deterministic
 * mock response built directly from the structured input — so the
 * comparison results page never depends on AI being available
 * (see spec section 36).
 */

function buildPrompt(input: AiRecommendationInput): string {
  const { requirements, categories } = input;
  const best = categories.best_overall;

  return `You are helping an Australian consumer understand NBN plan comparison results.
You must ONLY use the structured facts provided below. Do not invent prices, speeds,
contract terms, or features. If something is not in the data, say "Information not available."

Customer requirements:
${JSON.stringify(requirements, null, 2)}

Top recommended plan (structured data):
${best ? JSON.stringify(best.plan, null, 2) : "None"}

Category winners (structured data):
${JSON.stringify(
  Object.fromEntries(
    Object.entries(categories).map(([k, v]) => [k, v?.plan.planName])
  ),
  null,
  2
)}

Write a short (3-4 sentence) plain-English recommendation explaining why the top plan
suits this household, followed by 2-3 short bullet-point considerations. Respond ONLY
with JSON in this exact shape:
{"recommendation": "...", "reasoning": "...", "considerations": ["...", "..."]}`;
}

function buildMockResponse(input: AiRecommendationInput): AiRecommendationOutput {
  const { requirements, categories } = input;
  const best = categories.best_overall;

  if (!best) {
    return {
      recommendation:
        "We couldn't find a plan that confidently matches your requirements. Try adjusting your budget or usage selections.",
      reasoning: "No eligible plans were returned by the comparison engine.",
      considerations: ["Information not available."],
      source: "mock",
    };
  }

  const { plan } = best;
  const usageList =
    requirements.usageTypes.length > 0
      ? requirements.usageTypes.join(", ").replace(/_/g, " ")
      : "general household use";

  const recommendation = `Based on your household of ${requirements.householdSize} and typical use for ${usageList}, the ${plan.provider} ${plan.planName} is our top overall match. It offers ${plan.downloadSpeed} Mbps download and ${plan.uploadSpeed} Mbps upload for $${plan.ongoingPrice}/month ongoing, which fits within your stated budget and usage pattern.`;

  const reasoning = `This plan scored ${best.score}/100 using our transparent scoring model, balancing price, speed, suitability for your selected usage, contract flexibility and included features. See the Methodology page for how this score is calculated.`;

  const considerations: string[] = [
    plan.contractType === "No lock-in"
      ? "No lock-in contract, so you can switch later without penalty."
      : `This plan has a ${plan.contractType} contract.`,
    plan.uploadSpeedEstimated
      ? `Upload speed (${plan.uploadSpeed} Mbps) is an estimate — the provider doesn't publish an exact figure for this plan.`
      : `Published upload speed: ${plan.uploadSpeed} Mbps.`,
    plan.promoCode
      ? `A promo code (${plan.promoCode}) is currently available for this plan.`
      : "Confirm address-level availability and current pricing directly with the provider before signing up.",
  ];

  return { recommendation, reasoning, considerations, source: "mock" };
}

export async function getAiRecommendation(
  input: AiRecommendationInput
): Promise<AiRecommendationOutput> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildMockResponse(input);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: buildPrompt(input) }],
        temperature: 0.4,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      recommendation: parsed.recommendation ?? "Information not available.",
      reasoning: parsed.reasoning ?? "Information not available.",
      considerations: Array.isArray(parsed.considerations)
        ? parsed.considerations
        : [],
      source: "ai",
    };
  } catch {
    // AI must never break the core comparison experience.
    return buildMockResponse(input);
  }
}
