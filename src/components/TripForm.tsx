"use client";

import { useState } from "react";
import type { Trip, TripInput } from "@/lib/types";

export default function TripForm({
  onTripGenerated,
  onError,
}: {
  onTripGenerated: (trip: Trip, input: TripInput) => void;
  onError: (message: string) => void;
}) {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const input: TripInput = {
      destination,
      budget: Number(budget),
      days,
      interests,
    };

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        onError(data.error ?? "Something went wrong.");
      } else {
        onTripGenerated(data, input);
      }
    } catch {
      onError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">Destination</label>
        <input
          type="text"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Lisbon, Portugal"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Budget (USD)</label>
        <input
          type="number"
          required
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. 1500"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Number of days</label>
        <input
          type="number"
          required
          min={1}
          max={14}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Interests</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. food, museums, beaches"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate trip"}
      </button>
    </form>
  );
}