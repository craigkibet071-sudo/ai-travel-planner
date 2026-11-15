export type Activity = {
  name: string;
  description: string;
  type: "attraction" | "restaurant";
  timeOfDay: "morning" | "afternoon" | "evening";
  estimatedCost: number;
  latitude: number;
  longitude: number;
};

export type TripDay = {
  day: number;
  title: string;
  activities: Activity[];
};

export type Trip = {
  title: string;
  summary: string;
  estimatedTotalCost: number;
  days: TripDay[];
};
export type TripInput = {
  destination: string;
  budget: number;
  days: number;
  interests: string;
};