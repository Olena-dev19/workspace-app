export const dynamic = "force-dynamic";

import ItemsPage from "@/components/Items/ItemsPage";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getItemsByList } from "@/lib/item";
import { getListById } from "@/lib/lists";
import { requireWorkspaceAccess } from "@/lib/permissions";
import { getUserRole, getWorkspaceById } from "@/lib/workspace";

import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import React, { Suspense } from "react";
import ItemsSkeleton from "@/components/Skeletons/ItemsSkeleton";
import { ListDTO } from "@/types/dto/list.dto";
import { WorkspaceDTO } from "@/types/dto/workspace.dto";

interface Props {
  params: Promise<{
    workspaceId: string;
    listId: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: { listId: string };
}) {
  const { listId } = await params;
  const list = await getListById(listId);
  if (!list) return { title: "List", description: "" };
  return { title: list.name, description: list.description ?? "" };
}

export default async function ItemPage({ params }: Props) {
  await connectDB();

  const { listId, workspaceId } = await params;

  const user = await getCurrentUser();
  if (!user) return notFound();

  await requireWorkspaceAccess(workspaceId.toString());
  const workspace = (await getWorkspaceById(
    workspaceId,
  )) as WorkspaceDTO | null;

  const list = (await getListById(listId)) as ListDTO | null;

  if (!workspace || !list) return notFound();
  const items = await getItemsByList(listId);
  const userRole = getUserRole(workspace, user.id);
  const safeRole = (userRole ?? "member") as "owner" | "admin" | "member";

  return (
    <>
      <Breadcrumbs workspaceId={workspaceId} listId={listId} />
      <Suspense fallback={<ItemsSkeleton />}>
        <ItemsPage
          items={items}
          list={list}
          listId={listId}
          workspaceId={workspaceId}
          workspace={workspace}
          userRole={safeRole}
        />
      </Suspense>
    </>
  );
}
