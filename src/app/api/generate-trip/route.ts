import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { getMockTrip } from "@/lib/mockTrip";
import type { Trip } from "@/lib/types";
import { auth } from "@/lib/auth";

export const maxDuration = 60;
// The shape we require back. Strict mode needs every property listed
// in "required" and additionalProperties set to false.
const tripSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    estimatedTotalCost: { type: "number" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          title: { type: "string" },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                type: { type: "string", enum: ["attraction", "restaurant"] },
                timeOfDay: {
                  type: "string",
                  enum: ["morning", "afternoon", "evening"],
                },
                estimatedCost: { type: "number" },
                latitude: { type: "number" },
                longitude: { type: "number" },
              },
              required: [
                "name",
                "description",
                "type",
                "timeOfDay",
                "estimatedCost",
                "latitude",
                "longitude",
              ],
              additionalProperties: false,
            },
          },
        },
        required: ["day", "title", "activities"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "summary", "estimatedTotalCost", "days"],
  additionalProperties: false,
};

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in to generate a trip." },
      { status: 401 }
    );
  }
  const { destination, budget, days, interests } = await request.json();

  // Basic validation: never trust data coming from the browser
  if (!destination || !budget || !days) {
    return NextResponse.json(
      { error: "Destination, budget and days are required." },
      { status: 400 }
    );
  }

  // Mock mode: skip OpenAI entirely (useful while there's no billing set up)
  if (process.env.USE_MOCK === "true") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // fake delay
    return NextResponse.json(getMockTrip(destination, Number(days)));
  }

  const model = process.env.OPENAI_MODEL;
  if (!model || !process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing OPENAI_API_KEY or OPENAI_MODEL." },
      { status: 500 }
    );
  }

  try {
    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. Create realistic day-by-day itineraries that fit the traveler's budget. Include a mix of attractions and restaurants, with approximate GPS coordinates for each place. Costs are in USD per person.",
        },
        {
          role: "user",
          content: `Plan a ${days}-day trip to ${destination}. Total budget: $${budget} USD. Interests: ${interests || "general sightseeing"}.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "trip_itinerary",
          strict: true,
          schema: tripSchema,
        },
      },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from the model");
    }

    const trip: Trip = JSON.parse(content);
    return NextResponse.json(trip);
  } catch (error) {
    console.error("Trip generation failed:", error);
    return NextResponse.json(
      { error: "Could not generate the trip. Please try again." },
      { status: 500 }
    );
  }
}