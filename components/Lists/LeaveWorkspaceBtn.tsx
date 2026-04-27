"use client";

import { LeaveIcon } from "@/public/LogoutIcon";
import { deleteWorkspace } from "@/actions/workspace";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { leaveWorkspace } from "@/actions/user";
import css from "./LeaveWorkspaceBtn.module.css";

interface Props {
  userRole: "owner" | "admin" | "member";
  workspaceId: string;
}

export function LeaveWorkspaceBtn({ userRole, workspaceId }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      if (userRole === "owner") {
        await deleteWorkspace(workspaceId);
        toast.success("Workspace deleted");
      } else {
        await leaveWorkspace(workspaceId);
        toast.success("Left workspace");
      }

      router.push("/workspace");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    }
  };

  return (
    <button className={css.button} onClick={handleClick}>
      <LeaveIcon />
    </button>
  );
}
