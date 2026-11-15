"use client";

import { useTransition } from "react";
import { deleteTrip } from "@/app/actions";

export default function DeleteTripButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("Delete this trip? This can't be undone.")) return;

    startTransition(async () => {
      const result = await deleteTrip(id);
      if (!result.ok) {
        window.alert("Could not delete the trip. Please try again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="self-center rounded border border-red-400 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}