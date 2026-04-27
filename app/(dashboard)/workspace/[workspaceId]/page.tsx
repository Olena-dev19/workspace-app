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
import Link from "next/link";
import SettingsIcon from "@/public/SettingsIcon";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import React, { Suspense } from "react";
import WorkspaceMembersSkeleton from "@/components/Skeletons/WorkspaceMembersSkeleton";
import { LeaveWorkspaceBtn } from "@/components/Lists/LeaveWorkspaceBtn";

export async function generateMetadata({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = await params;
  const ws = await getWorkspaceById(workspaceId);
  if (!ws) return { title: "Workspace", description: "" };
  return { title: ws.name, description: ws.description ?? "" };
}

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

  const isMember = isWorkspaceMember(workspace, user.id.toString());
  if (!isMember) return notFound();

  const userRole = await getUserRole(workspace, user.id.toString());
  const safeRole = (userRole ?? "member") as "owner" | "admin" | "member";

  const canEdit = safeRole === "owner" || safeRole === "admin";

  return (
    <div>
      <div className={css.wrapper}>
        <Breadcrumbs workspaceId={workspaceId} />
        <div className={css.editsWrapper}>
          {canEdit && (
            <Link
              href={`/workspace/${workspaceId}/settings`}
              className={css.settingsButton}
            >
              <SettingsIcon />
            </Link>
          )}
          <LeaveWorkspaceBtn userRole={safeRole} workspaceId={workspace.id} />
        </div>
      </div>
      <h1 className={css.title}>{workspace.name}</h1>
      <p className={css.description}>{workspace.description}</p>
      <div className={css.createCont}>
        <Suspense fallback={<WorkspaceMembersSkeleton />}>
          <WorkspaceMembers
            members={workspace.members}
            workspaceId={workspaceId}
            userRole={safeRole}
          />
        </Suspense>

        <CreateListModal workspaceId={workspaceId} />
      </div>
      {lists.length === 0 ? (
        <div className={css.emptyState}>
          <p className={css.emptyTitle}>No lists yet</p>
          <p className={css.emptyHint}>Create your first list to get started</p>
        </div>
      ) : (
        <ListGrid lists={lists} userRole={safeRole} workspaceId={workspaceId} />
      )}
    </div>
  );
}
