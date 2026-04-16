"use client";
import css from "./ListCard.module.css";
import { useState } from "react";

interface Props {
  name: string;
  description?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export default function ListCard({
  name,
  description,
  createdAt,
  userName,
  userEmail,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={css.card} onClick={() => setOpen((prev) => !prev)}>
      <div className={css.header}>
        <h2>{name}</h2>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      {description && (
        <div className={`${css.description} ${open ? css.open : ""}`}>
          {description}
        </div>
      )}

      <div className={css.footer}>
        {userName && (
          <div className={css.avatar} title={userEmail || userName}>
            {userName[0].toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
