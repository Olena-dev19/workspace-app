"use client";

import ItemRow from "./ItemRow";
import css from "./ItemsTable.module.css";

export default function ItemsTable({ items, user }: any) {
  return (
    <div className={css.table}>
      {/* HEADER */}
      <div className={css.rowHeader}>
        <span></span>
        <span>Name</span>
        <span>Note</span>
        <span>Status</span>
        <span>User</span>
        <span>Date</span>
        <span></span>
      </div>

      {/* ROWS */}
      {items.map((item: any) => (
        <ItemRow key={item._id} item={item} user={user} />
      ))}
    </div>
  );
}
