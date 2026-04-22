"use client";

import { createItem } from "@/actions/item";
import { useState, useTransition } from "react";
import Modal from "../Modal/Modal";
import css from "./CreateItemModal.module.css";
import { useRouter } from "next/navigation";

interface Props {
  listId: string;
}

export default function CreateItemModal({ listId }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      createItem(formData);
      router.refresh();
      setOpen(false);
    });
  };
  return (
    <>
      <button className={css.addButton} onClick={() => setOpen(true)}>
        + Create Item
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2 className={css.title}>Create Item</h2>
          <button
            className={css.closeBtn}
            onClick={() => setOpen(false)}
            type="button"
          >
            ✖
          </button>
          <form action={handleSubmit}>
            <input type="hidden" name="listId" value={listId} />
            <input
              className={css.input}
              name="name"
              placeholder="Task name..."
            />
            <button className={css.button} disabled={isPending}>
              {isPending ? "Creating..." : "Add"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
