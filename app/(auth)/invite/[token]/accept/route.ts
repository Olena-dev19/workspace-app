import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { acceptInvite } from "@/actions/invite";

interface RouteContext {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    const result = await acceptInvite(token);

    revalidateTag(`workspace-${result.workspaceId}`, "max");

    revalidateTag(`user-workspaces-${result.userId}`, "max");

    return NextResponse.redirect(
      new URL(`/workspace/${result.workspaceId}`, request.url),
    );
  } catch (error) {
    console.error("Accept invite error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to accept invite";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
