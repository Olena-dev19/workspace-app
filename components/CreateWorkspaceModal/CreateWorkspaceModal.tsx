"use client";

import { useEffect, useState } from "react";
import css from "./CreateWorkspaceModal.module.css";
import { createWorkspace } from "@/actions/workspace";
import toast from "react-hot-toast";
import Modal from "../Modal/Modal";
import { useRouter } from "next/navigation";

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    try {
      await createWorkspace(formData);
      router.refresh();
      toast.success("Workspace created");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>+ Create Workspace</button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className={css.modal}>
            <h2 className={css.title}>Create Workspace</h2>
            <button
              className={css.closeBtn}
              onClick={() => setOpen(false)}
              type="button"
            >
              ✖
            </button>

            <label className={css.label}>
              Name Workspace
              <input name="name" placeholder="Name" className={css.input} />
            </label>

            <label className={css.label}>
              Description Workspace
              <textarea
                name="description"
                placeholder="Description"
                className={css.textarea}
                rows={2}
                maxLength={75}
              />
            </label>

            {loading ? (
              <button className={css.button} type="button" disabled>
                Creating...
              </button>
            ) : (
              <button className={css.button} type="submit">
                Create
              </button>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}
