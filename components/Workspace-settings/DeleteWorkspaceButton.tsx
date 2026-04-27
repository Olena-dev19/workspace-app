"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { deleteWorkspace } from "@/actions/workspace";

interface Props {
  workspaceId: string;
}

export function DeleteWorkspaceButton({ workspaceId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace? This action cannot be undone.",
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteWorkspace(workspaceId);

        toast.success("Workspace deleted successfully");

        router.push("/workspace");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete workspace",
        );
      }
    });
  };

  return (
    <button type="button" onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete Workspace"}
    </button>
  );
}
