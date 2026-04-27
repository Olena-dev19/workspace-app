export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal/CreateWorkspaceModal";
import css from "./Workspace.module.css";
import { getUserWorkspaces } from "@/lib/workspace";
import WorkspaceGrid from "@/components/WorkspaceGrid/WorkspaceGrid";
import { getCurrentUser } from "@/lib/auth";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import React, { Suspense } from "react";
import WorkspaceListSkeleton from "@/components/Skeletons/WorkspaceListSkeleton";

interface Props {
  searchParams: Promise<{
    filter?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  await connectDB();
  const { filter } = await searchParams;
  const user = await getCurrentUser();
  if (!user) return <div>No user</div>;

  const workspaces = await getUserWorkspaces(user.id.toString());

  const workspacesWithRole = workspaces.map((w) => {
    const member = w.members.find(
      (m) => m.user.id.toString() === user.id.toString(),
    );
    return { ...w, role: member?.role || "member" };
  });

  let filtered = workspacesWithRole;
  if (filter === "my") {
    filtered = workspacesWithRole.filter(
      (w) => w.ownerId.toString() === user.id.toString(),
    );
  }
  if (filter === "joint") {
    filtered = workspacesWithRole.filter((w) => w.members.length > 1);
  }

  return (
    <div className={css.container}>
      <Breadcrumbs filter={filter} />

      <div className={css.mainPageHeader}>
        <h1 className={css.title}>
          {filter === "my" ? "My " : filter === "joint" ? "Joint " : "All "}
          Workspaces
        </h1>
        <a className={css.createButton}>
          <CreateWorkspaceModal />
        </a>
      </div>
      <Suspense fallback={<WorkspaceListSkeleton />}>
        {filtered.length === 0 ? (
          <div className={css.emptyState}>
            <p className={css.emptyTitle}>No workspaces yet</p>
            <p className={css.emptyHint}>
              Create your first workspace to get started
            </p>
          </div>
        ) : (
          <WorkspaceGrid workspaces={filtered} />
        )}
      </Suspense>
    </div>
  );
}
