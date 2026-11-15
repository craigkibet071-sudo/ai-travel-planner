"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Trip } from "@/lib/types";

const DAY_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
];

// Zooms and pans the map so all visible points fit on screen
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);

  return null;
}

export default function TripMap({ trip }: { trip: Trip }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const visibleDays = useMemo(
    () =>
      selectedDay === null
        ? trip.days
        : trip.days.filter((d) => d.day === selectedDay),
    [trip, selectedDay]
  );

  const points = useMemo(
    () =>
      visibleDays.flatMap((d) =>
        d.activities.map((a) => [a.latitude, a.longitude] as [number, number])
      ),
    [visibleDays]
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDay(null)}
          className={`rounded border px-3 py-1 text-sm ${
            selectedDay === null ? "bg-blue-600 text-white" : ""
          }`}
        >
          All days
        </button>
        {trip.days.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`rounded border px-3 py-1 text-sm ${
              selectedDay === d.day ? "bg-blue-600 text-white" : ""
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-96 w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />

        {visibleDays.map((day) => {
          const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];

          return (
            <Fragment key={day.day}>
              <Polyline
                positions={day.activities.map(
                  (a) => [a.latitude, a.longitude] as [number, number]
                )}
                pathOptions={{ color, weight: 3, opacity: 0.6 }}
              />
              {day.activities.map((a, i) => (
                <CircleMarker
                  key={i}
                  center={[a.latitude, a.longitude]}
                  radius={9}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}
                >
                  <Popup>
                    <strong>{a.name}</strong>
                    <br />
                    Day {day.day} · {a.timeOfDay}
                    <br />
                    {a.description}
                  </Popup>
                </CircleMarker>
              ))}
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}