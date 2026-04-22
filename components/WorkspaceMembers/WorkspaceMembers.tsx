"use client";

import InviteButton from "../InviteButton/InviteButton";
import css from "./WorkspaceMembers.module.css";

export default function WorkspaceMembers({ members, workspaceId }: any) {
  return (
    <div className={css.wrapper}>
      {/* Invite */}
      <InviteButton workspaceId={workspaceId} />

      {/* Users */}
      {members.map((m: any) => {
        const user = m.userId;

        return (
          <div
            key={user._id}
            className={css.avatar}
            title={user?.email || user?.name}
          >
            {(user?.name || user?.email)?.[0]?.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
