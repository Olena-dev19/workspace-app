import { getServerSession } from "next-auth";
import css from "./layout.module.css";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";

import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { getUserCached } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const user = await getUserCached(session.user.id);
  const userName = user?.name || user?.email || "User";
  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <aside className={css.sidebar}>
        <Sidebar />
        <Link href="/settings" className={css.settings}>
          Settings
        </Link>
      </aside>

      {/* Main */}
      <div className={css.main}>
        <header className={css.header}>
          <div />
          <div> {userName}</div>
          <LogoutButton />
        </header>

        <main className={css.content}>
          {children}
          <div id="modal-root" />
        </main>
      </div>
    </div>
  );
}
