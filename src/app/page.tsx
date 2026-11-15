import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: "🗓️",
    title: "Day-by-day itineraries",
    text: "Get a full plan for every day, with morning, afternoon and evening activities that fit your budget.",
  },
  {
    icon: "📍",
    title: "Interactive map",
    text: "See every attraction and restaurant on a map, colored by day, and filter to one day at a time.",
  },
  {
    icon: "💾",
    title: "Save your trips",
    text: "Keep your favorite plans in a personal dashboard and come back to them whenever you like.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="animated-gradient relative flex min-h-[75vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto max-w-3xl px-8 py-20 text-center text-white">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Plan your next trip in seconds
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
            Choose a destination, set a budget and tell us what you love. Get a
            complete itinerary with places to visit, restaurants and a map.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/plan-trip"
              className="rounded bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Plan a trip
            </Link>
            <Link
              href="/dashboard"
              className="rounded border border-white/60 px-6 py-3 font-medium text-white hover:bg-white/10"
            >
              My trips
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-3xl gap-6 px-8 py-16 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border p-5">
            <div className="text-3xl" aria-hidden>
              {feature.icon}
            </div>
            <h2 className="mt-3 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm opacity-70">{feature.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}