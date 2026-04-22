"use client";

import css from "./SelectionToolbar.module.css";
import { DumpIcon } from "@/public/DumpIcon";

interface Props {
  deleteMode: boolean;
  selectedCount: number;

  onEnable: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function SelectionToolbar({
  deleteMode,
  selectedCount,
  onEnable,
  onCancel,
  onDelete,
}: Props) {
  return (
    <div className={css.toolbar}>
      {!deleteMode ? (
        <button className={css.deleteCont} onClick={onEnable}>
          <DumpIcon />
        </button>
      ) : (
        <>
          <span>
            {selectedCount === 0
              ? "Please choose items to delete"
              : `${selectedCount} selected`}
          </span>

          {selectedCount > 0 && (
            <button className={css.deleteButton} onClick={onDelete}>
              Delete
            </button>
          )}

          <button className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
