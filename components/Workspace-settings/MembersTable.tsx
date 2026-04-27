import { WorkspaceMemberDTO } from "@/types/dto/workspace.dto";
import MemberRow from "./MemberRow";
import css from "./MembersTable.module.css";

interface Props {
  members: WorkspaceMemberDTO[];
  workspaceId: string;
}
export function MembersTable({ members, workspaceId }: Props) {
  return (
    <div className={css.table}>
      {/* HEADER */}
      <div className={css.rowHeader}>
        <span></span>
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Delete</span>
        <span></span>
      </div>

      {/* ROWS */}
      {members.map((member: WorkspaceMemberDTO) => (
        <MemberRow
          key={member.user.id}
          member={member}
          workspaceId={workspaceId}
        />
      ))}
    </div>
  );
}
