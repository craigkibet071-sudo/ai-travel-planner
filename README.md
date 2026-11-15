# AI Travel Planner

A full-stack web app that generates day-by-day trip itineraries. Choose a destination, budget and interests, and get a plan with attractions, restaurants and an interactive map. Create an account to save trips to a personal dashboard and revisit them later.

**Live demo:** https://ai-travel-planner-u7qa.vercel.app/

## Features

- Email and password accounts, with every user's trips kept private
- Trip form with destination, budget, number of days and interests
- AI-generated itineraries returned as structured JSON (schema-validated)
- Interactive map with places colored by day and a per-day filter
- Dashboard with summary stats (trips, destinations, days planned, total budget) and a card for each saved trip
- Save, view and delete trips, stored in PostgreSQL
- Mock mode for developing and demoing without an AI API key

## Tech stack

- **Framework:** Next.js (App Router) with React and TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI API with Structured Outputs
- **Maps:** Leaflet and react-leaflet with OpenStreetMap tiles
- **Database:** PostgreSQL (hosted on Neon) with Prisma 7
- **Authentication:** Better Auth (email and password)
- **Hosting:** Vercel

## Screenshots

![Home page](docs/screenshots/home.png)
![Plan a trip](docs/screenshots/plan-trip.png)
![Dashboard](docs/screenshots/dashboard.png)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file for the database:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```

Create a `.env.local` file for the app:

```
USE_MOCK=true
OPENAI_API_KEY=
OPENAI_MODEL=
BETTER_AUTH_SECRET=generate-a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

With `USE_MOCK=true` the app returns sample itineraries and never calls OpenAI. To use real AI, set `USE_MOCK=false` and fill in your API key and a model that supports Structured Outputs.

### 3. Create the database tables

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    sign-in/         Sign-in page
    sign-up/         Sign-up page
    plan-trip/       Trip form and generated itinerary
    dashboard/       Stats and cards for saved trips
    trip/[id]/       A single saved trip (owner only)
    api/
      auth/          Authentication routes
      generate-trip/ Generates an itinerary (signed-in users)
      trips/         Saves a trip (signed-in users)
    actions.ts       Server action for deleting a trip
  components/        Form, itinerary, map, navbar and UI components
  lib/               Auth, Prisma client, OpenAI client, shared types, mock data
prisma/
  schema.prisma      Database schema
public/
  images/            Static images
```

## Known limitations

- Email addresses are not verified, and there is no password reset yet.
- AI-generated map coordinates are approximate and can be inaccurate.
- The public OpenStreetMap tile server is intended for light use. A hosted tile provider would be needed for heavy traffic.
- The hosted database sleeps when idle, so the first request after a quiet period can be slow or need a retry.

## Possible improvements

- Look up place coordinates with a geocoding service instead of relying on the model
- Email verification and password reset
- Edit and reorder activities in a saved trip
- Share a trip with a public link
- Per-user limits on trip generation

## Credits

Home page photo by [Albert](https://unsplash.com/@lilalbie?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/yosemite-valley-with-waterfall-at-golden-hour-oWS8yJmEWlQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).

Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
