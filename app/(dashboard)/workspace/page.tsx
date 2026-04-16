import { connectDB } from "@/lib/db";

import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal/CreateWorkspaceModal";
import css from "./Workspace.module.css";

import Link from "next/link";

import { getUserWorkspaces } from "@/lib/workspace";

interface Props {
  searchParams: Promise<{
    filter?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  await connectDB();
  const { filter } = await searchParams;
  const session = await getServerSession();

  const user = await User.findOne({
    email: session?.user?.email,
  });

  if (!user) return <div>No user</div>;

  const workspaces = await getUserWorkspaces(user._id.toString());

  let filtered = workspaces;
  if (filter === "my") {
    filtered = workspaces.filter(
      (w) => w.ownerId.toString() === user._id.toString(),
    );
  }
  if (filter === "joint") {
    filtered = workspaces.filter((w) => w.members.length > 1);
  }

  return (
    <div className={css.container}>
      <div className={css.mainPageHeader}>
        <h1 className={css.title}>
          {filter === "my" ? "My " : filter === "joint" ? "Joint" : "All"}
          Workspaces
        </h1>
        <a className={css.createButton}>
          <CreateWorkspaceModal />
        </a>
      </div>
      {filtered.length === 0 ? (
        <div className={css.emptyState}>
          <p className={css.emptyTitle}>No workspaces yet</p>
          <p className={css.emptyHint}>
            Create your first workspace to get started
          </p>
        </div>
      ) : (
        <div className={css.grid}>
          {filtered.map((w) => (
            <Link
              key={w._id.toString()}
              href={`/workspace/${w._id}`}
              className={css.card}
            >
              <h2>{w.name}</h2>
              <p>{w.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
