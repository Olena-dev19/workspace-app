"use client";

import { useSelection } from "@/hooks/useSelection";
import { useState } from "react";
import SelectionToolbar from "@/components/SelectionToolbar/SelectionToolbar";
import ListCard from "./ListCard";
import { deleteLists } from "@/actions/list";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import css from "./ListGrid.module.css";

export default function ListGrid({ lists, userRole, workspaceId }: any) {
  const { selected, toggle, clear } = useSelection();
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();

  const canDelete = userRole === "owner" || userRole === "admin";

  const handleDelete = async () => {
    const confirmDelete = confirm(`Delete ${selected.length} list(s)?`);
    if (!confirmDelete) return;

    await deleteLists(selected);
    router.refresh();
    toast.success("Lists deleted");

    clear();
    setDeleteMode(false);
  };

  return (
    <>
      {canDelete && (
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
      )}

      <div className={css.listsGrid}>
        {lists.map((list: any) => (
          <ListCard
            key={list.id}
            name={list.name}
            description={list.description}
            createdAt={list.createdAt}
            userName={list.createdBy?.name}
            userEmail={list.createdBy?.email}
            tasksCount={list.tasksCount}
            completedCount={list.completedCount}
            deleteMode={deleteMode}
            selected={selected.includes(list.id.toString())}
            onSelected={() => toggle(list.id.toString())}
            listId={list.id.toString()}
            workspaceId={workspaceId}
          />
        ))}
      </div>
    </>
  );
}
