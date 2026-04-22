import ItemsPage from "@/components/Items/ItemsPage";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getItemsByList } from "@/lib/item";
import { getListById, getListsByWorkspace } from "@/lib/lists";
import { requireWorkspaceAccess } from "@/lib/permissions";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    workspaceId: string;
    listId: string;
  }>;
}

export default async function ItemPage({ params }: Props) {
  await connectDB();

  const { listId, workspaceId } = await params;

  const user = await getCurrentUser();
  if (!user) return notFound();

  await requireWorkspaceAccess(workspaceId.toString());
  const list = await getListsByWorkspace(listId);
  const items = await getItemsByList(listId);

  return <ItemsPage items={items} list={list} listId={listId} user={user} />;
}
