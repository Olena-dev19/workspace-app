import { connectDB } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserRole,
  getWorkspaceById,
  isWorkspaceMember,
} from "@/lib/workspace";
import { getListsByWorkspace } from "@/lib/lists";
import css from "./workspace.module.css";
import CreateListModal from "@/components/Lists/CreateListModal";

import ListGrid from "@/components/Lists/ListsGrid";

import WorkspaceMembers from "@/components/WorkspaceMembers/WorkspaceMembers";

interface Props {
  params: Promise<{
    workspaceId: string;
  }>;
}
export default async function WorkspacePage({ params }: Props) {
  await connectDB();
  const { workspaceId } = await params;

  const user = await getCurrentUser();
  if (!user) return notFound();

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) return notFound();
  const lists = await getListsByWorkspace(workspaceId);
  const isMember = isWorkspaceMember(workspace, user._id.toString());
  if (!isMember) return notFound();

  const userRole = await getUserRole(workspace, user._id.toString());
  return (
    <div>
      <h1 className={css.title}>{workspace.name}</h1>
      <p className={css.description}>{workspace.description}</p>

      <div className={css.createCont}>
        <WorkspaceMembers
          members={workspace.members}
          workspaceId={workspaceId}
        />

        <CreateListModal workspaceId={workspaceId} />
      </div>

      {lists.length === 0 ? (
        <div className={css.emptyState}>
          <p className={css.emptyTitle}>No lists yet</p>
          <p className={css.emptyHint}>Create your first list to get started</p>
        </div>
      ) : (
        <ListGrid lists={lists} userRole={userRole} workspaceId={workspaceId} />
      )}
    </div>
  );
}
