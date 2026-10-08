import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";

export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    return {
      response: NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 },
      ),
    };
  }

  const role = (session.user as typeof session.user & { role?: string }).role;
  const roles = (role ?? "").split(",").map((value) => value.trim());

  if (!roles.includes("admin")) {
    return {
      response: NextResponse.json(
        { error: "You do not have permission to access this resource." },
        { status: 403 },
      ),
    };
  }

  return { session };
}
