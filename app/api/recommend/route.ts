import { NextResponse } from "next/server";
import type { CustomerRequirements } from "@/types";
import { getRecommendations } from "@/lib/comparison/engine";
import { getAiRecommendation } from "@/lib/ai/aiRecommendationService";

export async function POST(request: Request) {
  let requirements: CustomerRequirements;

  try {
    requirements = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!requirements?.householdSize || !requirements?.budget) {
    return NextResponse.json(
      { error: "Missing required questionnaire fields." },
      { status: 400 }
    );
  }

  try {
    const result = await getRecommendations(requirements);

    let ai = null;
    try {
      ai = await getAiRecommendation({
        requirements,
        eligiblePlans: result.eligiblePlans,
        categories: result.categories,
      });
    } catch {
      ai = null; // Ranking must not depend on AI availability.
    }

    return NextResponse.json({ ...result, ai });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate recommendations right now." },
      { status: 500 }
    );
  }
}
