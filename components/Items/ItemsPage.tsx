"use client";

import { useMemo, useState } from "react";
import css from "./ItemsPage.module.css";
import ItemsTable from "./ItemsTable";
import ItemsToolbar from "./ItemsToolbar";
import WorkspaceMembers from "../WorkspaceMembers/WorkspaceMembers";

export default function ItemsPage({
  items,
  list,
  listId,
  user,
  workspaceId,
  workspace,
}: any) {
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (filter === "open") {
      result = result.filter((i) => !i.isDone);
    }
    if (filter === "done") {
      result = result.filter((i) => i.isDone);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    return result;
  }, [items, filter, search, sort]);
  return (
    <div className={css.container}>
      {/* HEADER */}
      <div className={css.header}>
        <h1>{list.name}</h1>
        <p>{list.description}</p>
        <WorkspaceMembers
          members={workspace.members}
          workspaceId={workspaceId}
        />
      </div>

      {/* TOOLBAR */}
      <ItemsToolbar
        listId={listId}
        items={items}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {/* TABLE */}
      <ItemsTable items={filteredItems} user={user} />
    </div>
  );
}
