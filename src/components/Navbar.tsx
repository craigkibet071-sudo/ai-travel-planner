"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-3xl items-center gap-6 p-4">
        <Link href="/" className="font-bold">
          AI Travel Planner
        </Link>
        <Link href="/plan-trip" className="text-sm hover:underline">
          Plan a trip
        </Link>
        <Link href="/dashboard" className="text-sm hover:underline">
          My trips
        </Link>

        <div className="ml-auto flex items-center gap-4 text-sm">
          {isPending ? null : session ? (
            <>
              <span className="opacity-70">{session.user.name}</span>
              <button onClick={handleSignOut} className="hover:underline">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}