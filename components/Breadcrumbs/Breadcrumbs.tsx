import Link from "next/link";
import { getWorkspaceById } from "@/lib/workspace";
import { getListById } from "@/lib/lists";

interface Props {
  workspaceId?: string;
  listId?: string;
  filter?: string | null;
}

export default async function Breadcrumbs({
  workspaceId,
  listId,
  filter,
}: Props) {
  let workspaceName: string | null = null;
  let listName: string | null = null;

  if (workspaceId) {
    try {
      const ws = await getWorkspaceById(workspaceId);
      workspaceName = ws?.name ?? null;
    } catch (e) {
      console.debug("Breadcrumbs: getWorkspaceById failed", e);
    }
  }

  if (listId) {
    try {
      const list = await getListById(listId);
      listName = list?.name ?? null;
    } catch (e) {
      console.debug("Breadcrumbs: getListById failed", e);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href={`/workspace${filter ? `?filter=${filter}` : ""}`}>
        {"Workspaces"}
      </Link>

      {workspaceId && (
        <>
          <span>/</span>
          <Link href={`/workspace/${workspaceId}`}>
            {workspaceName || workspaceId}
          </Link>
        </>
      )}

      {listId && (
        <>
          <span>/</span>
          <span>{listName || listId}</span>
        </>
      )}
    </div>
  );
}
