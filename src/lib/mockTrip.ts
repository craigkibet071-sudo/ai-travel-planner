import type { Activity, Trip } from "@/lib/types";

function place(
  name: string,
  description: string,
  type: Activity["type"],
  timeOfDay: Activity["timeOfDay"],
  estimatedCost: number,
  latitude: number,
  longitude: number
): Activity {
  return { name, description, type, timeOfDay, estimatedCost, latitude, longitude };
}

type MockDestination = {
  label: string;
  keywords: string[];
  days: Trip["days"];
};

const destinations: MockDestination[] = [
  {
    label: "Lisbon",
    keywords: ["lisbon", "portugal"],
    days: [
      {
        day: 1,
        title: "Historic Lisbon",
        activities: [
          place("São Jorge Castle", "Hilltop castle with views across the city.", "attraction", "morning", 15, 38.7139, -9.1334),
          place("Time Out Market", "Food hall with stalls from top local chefs.", "restaurant", "afternoon", 25, 38.7067, -9.1459),
          place("Praça do Comércio", "Grand waterfront square, lovely at sunset.", "attraction", "evening", 0, 38.7075, -9.1364),
        ],
      },
      {
        day: 2,
        title: "Belém",
        activities: [
          place("Jerónimos Monastery", "Masterpiece of Portuguese Manueline architecture.", "attraction", "morning", 12, 38.6979, -9.2065),
          place("Pastéis de Belém", "The famous custard tart bakery, open since 1837.", "restaurant", "afternoon", 8, 38.6975, -9.2032),
          place("Belém Tower", "Riverside fortress and a symbol of the city.", "attraction", "evening", 10, 38.6916, -9.216),
        ],
      },
    ],
  },
  {
    label: "Madrid",
    keywords: ["madrid", "spain"],
    days: [
      {
        day: 1,
        title: "Royal Madrid",
        activities: [
          place("Royal Palace of Madrid", "Grand palace with ornate state rooms.", "attraction", "morning", 14, 40.418, -3.7143),
          place("Mercado de San Miguel", "Covered market with tapas and local produce.", "restaurant", "afternoon", 20, 40.4155, -3.709),
          place("Plaza Mayor", "Historic square lined with cafés.", "attraction", "evening", 0, 40.4155, -3.7074),
        ],
      },
      {
        day: 2,
        title: "Art and parks",
        activities: [
          place("Prado Museum", "One of the world's great art museums.", "attraction", "morning", 15, 40.4138, -3.6921),
          place("Retiro Park", "Large park with a lake and gardens.", "attraction", "afternoon", 0, 40.4153, -3.6844),
          place("Sobrino de Botín", "Historic restaurant known for roast suckling pig.", "restaurant", "evening", 45, 40.4142, -3.7081),
        ],
      },
    ],
  },
  {
    label: "Nairobi",
    keywords: ["nairobi", "kenya"],
    days: [
      {
        day: 1,
        title: "Wildlife and culture",
        activities: [
          place("Giraffe Centre", "Feed Rothschild's giraffes up close.", "attraction", "morning", 15, -1.3757, 36.7469),
          place("Carnivore Restaurant", "Famous for its grilled meats.", "restaurant", "afternoon", 35, -1.3305, 36.8018),
          place("Nairobi National Museum", "Kenya's history, nature and art.", "attraction", "evening", 10, -1.2742, 36.8141),
        ],
      },
      {
        day: 2,
        title: "Nature and history",
        activities: [
          place("Karura Forest", "Urban forest with trails and waterfalls.", "attraction", "morning", 5, -1.2395, 36.8332),
          place("Karen Blixen Museum", "Historic farmhouse of the author of Out of Africa.", "attraction", "afternoon", 12, -1.3524, 36.7127),
        ],
      },
    ],
  },
];

export function getMockTrip(destination: string, days: number): Trip {
  const query = destination.toLowerCase();
  const match = destinations.find((d) =>
    d.keywords.some((keyword) => query.includes(keyword))
  );
  const chosen = match ?? destinations[0];

  const selected = chosen.days.slice(0, Math.max(1, days));
  const total = selected
    .flatMap((d) => d.activities)
    .reduce((sum, a) => sum + a.estimatedCost, 0);

  return {
    title: match
      ? `Sample trip: ${chosen.label}`
      : `Sample trip (no sample for "${destination}", showing ${chosen.label})`,
    summary:
      "This is placeholder data from mock mode. Real AI itineraries for any destination will appear once the OpenAI API is connected.",
    estimatedTotalCost: total,
    days: selected,
  };
}