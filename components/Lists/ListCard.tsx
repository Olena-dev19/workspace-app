"use client";
import { useRouter } from "next/navigation";
import css from "./ListCard.module.css";
import { useState } from "react";

interface Props {
  name: string;
  description?: string;
  createdAt: Date;
  userName?: string;
  userEmail?: string;
  workspaceId: string;
  listId: string;

  tasksCount: number;
  completedCount: number;

  deleteMode?: boolean;
  selected?: boolean;
  onSelected?: () => void;
}

export default function ListCard({
  name,
  description,
  createdAt,
  userName,
  userEmail,
  tasksCount,
  completedCount,
  deleteMode,
  selected,
  workspaceId,
  listId,
  onSelected,
}: Props) {
  const router = useRouter();
  const progress =
    tasksCount === 0 ? 0 : Math.round((completedCount / tasksCount) * 100);
  return (
    <div
      className={`${css.card} ${selected ? css.active : ""}`}
      onClick={() => {
        if (deleteMode) {
          onSelected?.();
        } else {
          router.push(`/workspace/${workspaceId}/lists/${listId}`);
        }
      }}
    >
      {/* Header */}
      <div className={css.header}>
        <h2>{name}</h2>
        <span>
          {new Date(createdAt).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>
      </div>
      {/* Tasks Count */}
      <div className={css.task}>Tasks {tasksCount}</div>
      <div className={css.progressBar}>
        <div className={css.progress} style={{ width: `${progress}%` }} />
      </div>
      {/* Footer */}
      <div className={css.footer}>
        {(userName || userEmail) && (
          <div className={css.avatar} title={userEmail || userName}>
            {(userName || userEmail)?.[0].toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
