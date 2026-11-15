"use client";

import dynamic from "next/dynamic";
import type { Trip } from "@/lib/types";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg border">
      Loading map...
    </div>
  ),
});

export default function TripMapLoader({ trip }: { trip: Trip }) {
  return <TripMap trip={trip} />;
}