"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { WorkspaceMemberDTO } from "@/types/dto/workspace.dto";
import type { Role } from "@/types/workspace";
import css from "./MembersRow.module.css";
import { removeWorkspaceMember, updateMemberRole } from "@/actions/workspace";

interface Props {
  member: WorkspaceMemberDTO;
  workspaceId: string;
}

export default function MemberRow({ member, workspaceId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "owner" | "admin" | "member";
    setLoading(true);
    startTransition(async () => {
      try {
        await updateMemberRole(workspaceId, member.user.id, newRole as Role);

        toast.success("Role updated");
        router.refresh();
      } catch (err) {
        toast.error((err as Error)?.message || "Error");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${member.user.name} from workspace?`)) return;
    setLoading(true);
    startTransition(async () => {
      try {
        await removeWorkspaceMember(workspaceId, member.user.id);
        toast.success("Member removed");
        router.refresh();
      } catch (err) {
        toast.error((err as Error)?.message || "Error");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className={css.row}>
      <div></div>
      <div>{member.user.name}</div>
      <div>{member.user.email}</div>
      <select
        value={member.role}
        onChange={handleRoleChange}
        disabled={loading}
      >
        <option value="member">Member</option>
        <option value="admin">Admin</option>
        <option value="owner" disabled={true}>
          Owner
        </option>
      </select>
      <button
        onClick={handleRemove}
        disabled={loading || member.role === "owner"}
      >
        x
      </button>
      <div></div>
    </div>
  );
}
