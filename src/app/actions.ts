"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function deleteTrip(id: string) {
  const session = await getSession();
  if (!session) return { ok: false };

  try {
    // The userId condition means you can only delete your own trips
    await prisma.trip.deleteMany({
      where: { id, userId: session.user.id },
    });
  } catch (error) {
    console.error("Deleting trip failed:", error);
    return { ok: false };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}