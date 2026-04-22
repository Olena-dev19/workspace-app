"use client";

import { useState } from "react";
import CreateItemModal from "./CreateItemModal";
import css from "./ItemsToolbar.module.css";

export default function ItemsToolbar({
  items,
  listId,
  filter,
  setFilter,
  search,
  setSearch,
  sort,
  setSort,
}: any) {
  const total = items.length;
  const done = items.filter((i: any) => i.isDone).length;
  const open = total - done;

  return (
    <div className={css.toolbar}>
      {/* FILTERS */}
      <div className={css.filters}>
        <button
          className={filter === "all" ? css.active : ""}
          onClick={() => setFilter("all")}
        >
          All {total}
        </button>
        <button
          className={filter === "open" ? css.active : ""}
          onClick={() => setFilter("open")}
        >
          Open {open}
        </button>
        <button
          className={filter === "done" ? css.active : ""}
          onClick={() => setFilter("done")}
        >
          Done {done}
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className={css.search}
      />

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={css.sort}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      {/* ADD */}
      <CreateItemModal listId={listId} />
    </div>
  );
}
