"use client";

import { signOut } from "next-auth/react";
import css from "./LogoutButton.module.css";
import { LogoutIcon } from "@/public/LogoutIcon";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/sign-in",
        })
      }
      className={css.button}
    >
      <LogoutIcon />
    </button>
  );
}
