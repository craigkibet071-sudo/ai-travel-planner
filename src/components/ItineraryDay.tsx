import type { TripDay } from "@/lib/types";

const timeLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export default function ItineraryDay({ day }: { day: TripDay }) {
  return (
    <div className="rounded-lg border p-5">
      <h3 className="text-xl font-semibold">
        Day {day.day}: {day.title}
      </h3>

      <ul className="mt-4 space-y-4">
        {day.activities.map((activity, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-2xl" aria-hidden>
              {activity.type === "restaurant" ? "🍽️" : "📍"}
            </span>
            <div>
              <p className="font-medium">{activity.name}</p>
              <p className="text-sm opacity-70">
                {timeLabels[activity.timeOfDay]} ·{" "}
                {activity.estimatedCost === 0
                  ? "Free"
                  : `$${activity.estimatedCost}`}
              </p>
              <p className="mt-1 text-sm">{activity.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}