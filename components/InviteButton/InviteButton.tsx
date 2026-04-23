"use client";

import { AddUser } from "@/public/AddUser";
import { useState } from "react";
import toast from "react-hot-toast";
import { createInvite } from "@/actions/invite";
import css from "./InviteButton.module.css";

export default function InviteButton({ workspaceId }: any) {
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    try {
      const data = await createInvite(workspaceId);

      try {
        await navigator.clipboard.writeText(data.link);
        toast.success("Link copied 🔗");
      } catch {
        prompt("Copy your invite link:", data.link);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={css.button} onClick={handleInvite} disabled={loading}>
      <AddUser />
    </button>
  );
}
