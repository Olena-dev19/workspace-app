import { getServerSession } from "next-auth";
import css from "./layout.module.css";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const userName = session?.user?.name || session?.user?.email || "User";
  return (
    <div className={css.container}>
      {/* Sidebar */}
      <aside className={css.sidebar}>
        <div className={css.logo}>Workspace</div>
        <nav>
          <div className={css.navItem}>Dashboard</div>
          <div className={css.navItem}>Settings</div>
        </nav>
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
