"use client";

import { WorkspaceMemberDTO } from "@/types/dto/workspace.dto";
import InviteButton from "../InviteButton/InviteButton";
import css from "./WorkspaceMembers.module.css";
import { Role } from "@/types/workspace";

interface Props {
  members: WorkspaceMemberDTO[];
  workspaceId: string;
  userRole: Role;
}
export default function WorkspaceMembers({
  members,
  workspaceId,
  userRole,
}: Props) {
  const canInvite = userRole === "owner" || userRole === "admin";
  return (
    <div className={css.wrapper}>
      {/* Invite */}
      {canInvite && <InviteButton workspaceId={workspaceId} />}

      {/* Users */}
      {members.map((m) => {
        return (
          <div
            key={m.user.id}
            className={css.avatar}
            title={m.user?.email || m.user?.name}
          >
            {(m.user?.name || m.user?.email)?.[0]?.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
