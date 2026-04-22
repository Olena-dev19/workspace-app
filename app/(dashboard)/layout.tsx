import { getServerSession } from "next-auth";
import css from "./layout.module.css";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // const user = await getCurrentUser();
  const userName = session?.user?.name || session?.user?.email || "User";
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
          <Breadcrumbs />
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
