import { getServerSession } from "next-auth";
import css from "./layout.module.css";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Toaster } from "react-hot-toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const userName = session?.user?.name || session?.user?.email || "User";
  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <aside className={css.sidebar}>
        <Sidebar />
        <div className={css.settings}>Settings</div>
      </aside>

      {/* Main */}
      <div className={css.main}>
        <header className={css.header}>
          <div>Dashboard</div>
          <div> {userName}</div>
          <LogoutButton />
        </header>

        <main className={css.content}>{children}</main>
      </div>
    </div>
  );
}
