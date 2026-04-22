"use client";

import { useSelection } from "@/hooks/useSelection";
import { useRouter } from "next/navigation";
import css from "./WorkspaceGrid.module.css";

import { deleteWorkspaces } from "@/actions/workspace";
import toast from "react-hot-toast";

import { useState } from "react";
import SelectionToolbar from "../SelectionToolbar/SelectionToolbar";

export default function WorkspaceGrid({ workspaces, userId }: any) {
  const { selected, toggle, clear } = useSelection();
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();
  const canDelete = (w: any) => w.role === "owner" || w.role === "admin";
  const handleDelete = async () => {
    const confirmDelete = confirm(`Delete ${selected.length} workspace(s)?`);

    if (!confirmDelete) return;

    await deleteWorkspaces(selected);
    router.refresh();
    toast.success("Deleted workspace(s) successfully");
    clear();
    setDeleteMode(false);
  };

  return (
    <>
      <SelectionToolbar
        deleteMode={deleteMode}
        selectedCount={selected.length}
        onEnable={() => setDeleteMode(true)}
        onCancel={() => {
          setDeleteMode(false);
          clear();
        }}
        onDelete={handleDelete}
      />

      {/* GRID */}
      <div className={css.grid}>
        {workspaces.map((w: any) => (
          <div
            key={w._id}
            className={`${css.card} ${
              selected.includes(w._id.toString()) ? css.active : ""
            }`}
            onClick={(e) => {
              if (deleteMode) {
                e.preventDefault();
                if (canDelete(w)) toggle(w._id);
              } else {
                router.push(`/workspace/${w._id}`);
              }
            }}
          >
            <h3>{w.name}</h3>

            <p>{w.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
