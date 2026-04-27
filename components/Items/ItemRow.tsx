"use client";

import { deleteItem, toggleItem, updateItem } from "@/actions/item";
import css from "./ItemRow.module.css";
import { useState, useTransition } from "react";
import { ItemDTO } from "@/types/dto/item.dto";

interface Props {
  item: ItemDTO;
}

export default function ItemRow({ item }: Props) {
  const [isDone, setIsDone] = useState(item.isDone);
  const [, startTransition] = useTransition();

  const [editingField, setEditingField] = useState<"name" | "note" | null>(
    null,
  );

  const [form, setForm] = useState({
    name: item.name,
    note: item.note || "",
  });
  const author = item.createdBy;
  const handleToggle = () => {
    const newValue = !isDone;
    setIsDone(newValue);

    startTransition(async () => {
      try {
        await toggleItem(item.id);
      } catch {
        setIsDone(!newValue);
      }
    });
  };

  const handleChange = (field: "name" | "note", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (field: "name" | "note") => {
    const value = form[field];

    if (value.trim() === item[field]) {
      setEditingField(null);
      return;
    }

    startTransition(async () => {
      try {
        await updateItem(item.id, {
          [field]: value,
        });
      } catch {
        setForm({
          name: item.name,
          note: item.note || "",
        });
      } finally {
        setEditingField(null);
      }
    });
  };

  return (
    <div className={css.row}>
      {/* CHECKBOX */}
      <label className={css.checkbox}>
        <input type="checkbox" checked={isDone} onChange={handleToggle} />
        <span className={css.checkmark}></span>
      </label>

      {/* NAME */}
      {editingField === "name" ? (
        <input
          className={css.input}
          value={form.name}
          autoFocus
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleSave("name")}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave("name");
          }}
        />
      ) : (
        <span
          onDoubleClick={() => setEditingField("name")}
          className={isDone ? css.done : ""}
        >
          {form.name}
        </span>
      )}

      {/* NOTE */}
      {editingField === "note" ? (
        <textarea
          className={css.textarea}
          value={form.note}
          autoFocus
          onChange={(e) => handleChange("note", e.target.value)}
          onBlur={() => handleSave("note")}
        />
      ) : (
        <span
          className={css.note}
          onDoubleClick={() => setEditingField("note")}
        >
          {form.note || "Add note..."}
        </span>
      )}

      {/* STATUS */}
      <span className={isDone ? css.doneStatus : css.openStatus}>
        {isDone ? "Done" : "Open"}
      </span>

      {/* AVATAR */}
      <div className={css.avatar} title={author?.email || author?.name}>
        {(author?.name || author?.email)?.[0]?.toUpperCase()}
      </div>

      {/* DATE */}
      <span>{new Date(item.createdAt).toLocaleDateString("uk-UA")}</span>

      {/* DELETE */}
      <button onClick={() => deleteItem(item.id)}>✖</button>
    </div>
  );
}
