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
import ListCard from "@/components/Lists/ListCard";

interface Props {
  params: Promise<{
    workspaceId: string;
  }>;
}
export default async function WorkspacePage({ params }: Props) {
  await connectDB();
  const { workspaceId } = await params;

  // const lists = await getListsByWorkspace(workspaceId);

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
      <h1>{workspace.name}</h1>
      <p>{workspace.description}</p>
      {(userRole === "admin" || userRole === "owner") && (
        <button>Delete workspace</button>
      )}
      <h2>Lists</h2>
      <CreateListModal workspaceId={workspaceId} />
      {lists.length === 0 ? (
        <p>No lists yet</p>
      ) : (
        <ul className={css.listsGrid}>
          {lists.map((list) => (
            <ListCard
              key={list._id.toString()}
              name={list.name}
              description={list.description}
              createdAt={list.timestamps.toString()}
              // userName={list.userName}
              // userEmail={list.userEmail}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
