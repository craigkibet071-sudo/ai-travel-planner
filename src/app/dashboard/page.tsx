import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import DeleteTripButton from "@/components/DeleteTripButton";

// Turns a destination name into a stable color, so each place keeps its own
function hueFor(text: string) {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }
  return hash;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My trips</h1>
        <Link
          href="/plan-trip"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New trip
        </Link>
      </div>
      <Suspense fallback={<p className="opacity-70">Loading trips...</p>}>
        <TripList />
      </Suspense>
    </main>
  );
}

async function TripList() {
  const session = await getSession();

  if (!session) {
    return (
      <p>
        Please{" "}
        <Link href="/sign-in" className="text-blue-500 underline">
          sign in
        </Link>{" "}
        to see your trips.
      </p>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      destination: true,
      title: true,
      days: true,
      budget: true,
      createdAt: true,
    },
  });

  if (trips.length === 0) {
    return (
      <p>
        No saved trips yet.{" "}
        <Link href="/plan-trip" className="text-blue-500 underline">
          Plan your first trip
        </Link>
      </p>
    );
  }

  const totalDays = trips.reduce((sum, trip) => sum + trip.days, 0);
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const destinationCount = new Set(
    trips.map((trip) => trip.destination.trim().toLowerCase())
  ).size;

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Trips saved" value={trips.length} />
        <Stat label="Destinations" value={destinationCount} />
        <Stat label="Days planned" value={totalDays} />
        <Stat
          label="Total budget"
          value={`$${totalBudget.toLocaleString("en-US")}`}
        />
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => {
          const hue = hueFor(trip.destination);

          return (
            <li
              key={trip.id}
              className="flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={`/trip/${trip.id}`} className="block flex-1">
                <div
                  className="flex h-28 items-end p-4 text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 70% 40%), hsl(${(hue + 50) % 360} 75% 55%))`,
                  }}
                >
                  <p className="text-lg font-semibold drop-shadow">
                    ✈️ {trip.destination}
                  </p>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold">{trip.title}</h2>
                  <p className="mt-1 text-sm opacity-70">
                    {trip.days} days · ${trip.budget} budget
                  </p>
                  <p className="mt-1 text-xs opacity-50">
                    Saved{" "}
                    {trip.createdAt.toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end border-t p-3">
                <DeleteTripButton id={trip.id} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}