"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { updateWorkspace } from "@/actions/workspace";
import { WorkspaceDTO, WorkspaceMemberDTO } from "@/types/dto/workspace.dto";

import { MembersTable } from "./MembersTable";
import { DeleteWorkspaceButton } from "./DeleteWorkspaceButton";

import css from "./WorkspaceSettingsForm.module.css";

interface Props {
  workspace: WorkspaceDTO;
}

export interface WorkspaceFormState {
  success: boolean;
  error: string;
  message: string;
}

const initialState: WorkspaceFormState = {
  success: false,
  error: "",
  message: "",
};

export default function WorkspaceSettingsForm({ workspace }: Props) {
  const router = useRouter();

  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description ?? "");

  const [members, setMembers] = useState<WorkspaceMemberDTO[]>(
    workspace.members,
  );

  const [state, formAction, pending] = useActionState(
    updateWorkspace.bind(null, workspace.id),
    initialState,
  );

  useEffect(() => {
    setName(workspace.name);
    setDescription(workspace.description ?? "");
    setMembers(workspace.members);
  }, [workspace]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.refresh();
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className={css.wrapper}>
      <form action={formAction} className={css.section}>
        <h2 className={css.subTitle}>General Settings</h2>

        <label className={css.label}>Workspace name</label>

        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={css.input}
        />

        <label className={css.label}>Description</label>

        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={css.textarea}
        />

        <button type="submit" disabled={pending} className={css.saveButton}>
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <MembersTable members={members} workspaceId={workspace.id} />

      <section className={css.danger}>
        <h2>Danger Zone</h2>

        <DeleteWorkspaceButton workspaceId={workspace.id} />
      </section>
    </div>
  );
}
