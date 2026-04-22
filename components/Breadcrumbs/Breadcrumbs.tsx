"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workspaceId = params.workspaceId as string;
  const listId = params.listId as string;
  const filter = searchParams.get("filter");

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href={`/workspace${filter ? `?filter=${filter}` : ""}`}>
        Workspaces
      </Link>

      {workspaceId && (
        <>
          <span>/</span>
          <Link href={`/workspace/${workspaceId}`}>{workspaceId}</Link>
        </>
      )}

      {listId && (
        <>
          <span>/</span>
          <span>{listId}</span>
        </>
      )}
    </div>
  );
}
