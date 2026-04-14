import { connectDB } from "@/lib/db";
import { Workspace } from "@/models/Workspace";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal/CreateWorkspaceModal";
import css from "./Workspace.module.css";
import { WorkspaceType } from "@/types/workspace";
import Link from "next/link";

export default async function Page() {
  await connectDB();

  const session = await getServerSession();

  const user = await User.findOne({
    email: session?.user?.email,
  });

  if (!user) return <div>No user</div>;

  const workspaces = await Workspace.find({
    "members.userId": user._id,
  }).lean<WorkspaceType[]>();

  return (
    <div className={css.container}>
      <div className={css.mainPageHeader}>
        <h1 className={css.title}>My Workspaces</h1>
        <a className={css.createButton}>
          <CreateWorkspaceModal />
        </a>
      </div>

      {/* GRID як у макеті */}
      <div className={css.grid}>
        {workspaces.map((w) => (
          <Link
            key={w._id.toString()}
            href={`/w/${w._id}`}
            className={css.card}
          >
            <h2>{w.name}</h2>
            <p>{w.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
