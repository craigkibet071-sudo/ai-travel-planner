"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import TripForm from "@/components/TripForm";
import ItineraryDay from "@/components/ItineraryDay";
import { authClient } from "@/lib/auth-client";
import type { Trip, TripInput } from "@/lib/types";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border">
      Loading map...
    </div>
  ),
});

export default function PlanTripPage() {
  const { data: session, isPending } = authClient.useSession();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [input, setInput] = useState<TripInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function saveTrip() {
    if (!trip || !input) return;
    setSaving(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, trip }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not save the trip.");
      } else {
        setError(null);
        setSavedId(data.id);
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Plan your trip</h1>

      {isPending ? null : session ? (
        <TripForm
          onTripGenerated={(newTrip, newInput) => {
            setError(null);
            setTrip(newTrip);
            setInput(newInput);
            setSavedId(null);
          }}
          onError={(message) => {
            setTrip(null);
            setError(message);
          }}
        />
      ) : (
        <p className="rounded border p-4">
          Please{" "}
          <Link href="/sign-in" className="text-blue-500 underline">
            sign in
          </Link>{" "}
          or{" "}
          <Link href="/sign-up" className="text-blue-500 underline">
            create an account
          </Link>{" "}
          to plan and save trips.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}

      {trip && (
        <section className="mt-10 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{trip.title}</h2>
            <p className="mt-2 opacity-80">{trip.summary}</p>
            <p className="mt-2 font-medium">
              Estimated total: ${trip.estimatedTotalCost}
            </p>
            <div className="mt-4 flex items-center">
              <button
                onClick={saveTrip}
                disabled={saving || savedId !== null}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {savedId ? "Saved ✓" : saving ? "Saving..." : "Save trip"}
              </button>
              {savedId && (
                <Link
                  href={`/trip/${savedId}`}
                  className="ml-4 text-sm text-blue-500 underline"
                >
                  View saved trip
                </Link>
              )}
            </div>
          </div>

          <TripMap trip={trip} />

          {trip.days.map((day) => (
            <ItineraryDay key={day.day} day={day} />
          ))}
        </section>
      )}
    </main>
  );
}