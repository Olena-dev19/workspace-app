"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import css from "./Sidebar.module.css";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "all";

  const [open, setOpen] = useState(true);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleFilter = (filter: string) => {
    router.push(`/workspace?filter=${filter}`);
  };

  return (
    <aside>
      <Link href="/workspace" className={css.logo}>
        <svg
          xmlns="http://w3.org"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Workspace
      </Link>
      <div className={css.menu} onClick={toggleMenu}>
        Dashboard {open ? "●" : "○"}
      </div>

      {open && (
        <div className={css.submenu}>
          <div
            className={`${css.item} ${
              currentFilter === "my" ? css.active : ""
            }`}
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
      )}
    </aside>
  );
}
