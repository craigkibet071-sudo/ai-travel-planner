import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Prisma } from "@/generated/prisma/client";
import type { Trip, TripInput } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in to save trips." },
      { status: 401 }
    );
  }

  const { input, trip } = (await request.json()) as {
    input: TripInput;
    trip: Trip;
  };

  if (!input?.destination || !trip?.title || !Array.isArray(trip?.days)) {
    return NextResponse.json({ error: "Invalid trip data." }, { status: 400 });
  }

  try {
    const saved = await prisma.trip.create({
      data: {
        destination: input.destination,
        budget: Math.round(Number(input.budget)),
        days: Number(input.days),
        interests: input.interests || null,
        title: trip.title,
        itinerary: trip as unknown as Prisma.InputJsonValue,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ id: saved.id });
  } catch (error) {
    console.error("Saving trip failed:", error);
    return NextResponse.json(
      { error: "Could not save the trip." },
      { status: 500 }
    );
  }
}