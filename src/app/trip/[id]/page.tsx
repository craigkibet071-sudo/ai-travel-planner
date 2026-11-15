import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ItineraryDay from "@/components/ItineraryDay";
import TripMapLoader from "@/components/TripMapLoader";
import type { Trip } from "@/lib/types";

export default function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/dashboard" className="text-sm text-blue-500 underline">
        ← Back to my trips
      </Link>
      <Suspense fallback={<p className="mt-6 opacity-70">Loading trip...</p>}>
        <TripDetails params={params} />
      </Suspense>
    </main>
  );
}

async function TripDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect("/sign-in");

  // Only find the trip if it belongs to the signed-in user
  const saved = await prisma.trip.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!saved) notFound();

  const trip = saved.itinerary as unknown as Trip;

  return (
    <section className="mt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <p className="mt-1 text-sm opacity-70">
          {saved.destination} · {saved.days} days · ${saved.budget} budget
        </p>
        <p className="mt-3 opacity-80">{trip.summary}</p>
        <p className="mt-2 font-medium">
          Estimated total: ${trip.estimatedTotalCost}
        </p>
      </div>

      <TripMapLoader trip={trip} />

      {trip.days.map((day) => (
        <ItineraryDay key={day.day} day={day} />
      ))}
    </section>
  );
}