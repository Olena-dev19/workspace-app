"use client";

import { useState, useEffect } from "react";
import { createList } from "@/actions/list";
import css from "./CreateListModal.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "../Modal/Modal";

export default function CreateListModal({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

    try {
      await createList(formData);

      router.refresh();
      toast.success("List created");
      form.reset();
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <button className={css.addButton} onClick={() => setOpen(true)}>
        + Create List
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className={css.modal}>
            <h2 className={css.title}>Create List</h2>
            <button
              className={css.closeBtn}
              onClick={handleClose}
              type="button"
            >
              ✖
            </button>
            <label className={css.label}>
              <input type="hidden" name="workspaceId" value={workspaceId} />
            </label>

            <label className={css.label}>
              Name
              <input
                className={css.input}
                name="name"
                placeholder="List name"
              />
            </label>
            <label className={css.label}>
              Description
              <textarea
                name="description"
                placeholder="Description"
                className={css.textarea}
                rows={2}
                maxLength={75}
              />
            </label>

            <button className={css.button} type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
