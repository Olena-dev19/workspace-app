"use client";
import { useRouter, useSearchParams } from "next/navigation";
import css from "./Sidebar.module.css";
import Link from "next/link";
import { LogoIcon } from "@/public/LogoIcon";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "all";

  const handleFilter = (filter: string) => {
    router.push(`/workspace?filter=${filter}`);
  };

  return (
    <aside>
      <Link href="/workspace" className={css.logo}>
        <LogoIcon />
        Workspace
      </Link>
      <Link href={"/workspace"} className={css.menu}>
        Dashboard
      </Link>

      <div className={css.submenu}>
        <div
          className={`${css.item} ${currentFilter === "my" ? css.active : ""}`}
          onClick={() => handleFilter("my")}
        >
          My workspaces
        </div>

        <div
          className={`${css.item} ${
            currentFilter === "joint" ? css.active : ""
          }`}
          onClick={() => handleFilter("joint")}
        >
          Joint workspaces
        </div>
      </div>
    </aside>
  );
}
