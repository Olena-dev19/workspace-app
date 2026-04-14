"use client";

import { useState } from "react";
import css from "./CreateWorkspaceModal.module.css";
import { createWorkspace } from "@/actions/workspace";

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>+ Create Workspace</button>

      {open && (
        <div className={css.overlay}>
          <form
            action={async (formData) => {
              await createWorkspace(formData);
              setOpen(false);
            }}
            className={css.modal}
          >
            <h2 className={css.title}>Create Workspace</h2>
            <button className={css.closeBtn} onClick={() => setOpen(false)}>
              ✖
            </button>

            <label className={css.label}>
              Name Workspace
              <input name="name" placeholder="Name" className={css.input} />
            </label>

            <label className={css.label}>
              Description Workspace
              <input
                name="description"
                placeholder="Description"
                className={css.input}
              />
            </label>

            <button className={css.button} type="submit">
              Create
            </button>
          </form>
        </div>
      )}
    </>
  );
}
