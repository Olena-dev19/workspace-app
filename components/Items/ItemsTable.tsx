"use client";

import { ItemDTO } from "@/types/dto/item.dto";
import ItemRow from "./ItemRow";
import css from "./ItemsTable.module.css";
interface Props {
  items: ItemDTO[];
}
export default function ItemsTable({ items }: Props) {
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
      {items.map((item: ItemDTO) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}
