"use client";

import { useEffect, useState, type ReactNode } from "react";

type Row = { id: string; cells: ReactNode[] };

/**
 * Admin table with drag-to-reposition rows. The ⠿ handle initiates the drag;
 * dropping a row on another moves it to that spot and persists the full order
 * via the provided server action (0..n-1). Falls back to the server order
 * whenever the server re-renders (deletes, refresh, failed save).
 */
export function DragTable({
  headers,
  rows,
  onReorder,
  emptyText,
}: {
  headers: string[];
  rows: Row[];
  onReorder: (ids: string[]) => Promise<void>;
  emptyText: string;
}) {
  const [order, setOrder] = useState<Row[]>(rows);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // adopt server order after every server re-render (post revalidation)
  useEffect(() => {
    setOrder(rows);
  }, [rows]);

  const drop = async (targetId: string) => {
    const from = order.findIndex((r) => r.id === dragId);
    const to = order.findIndex((r) => r.id === targetId);
    setDragId(null);
    setOverId(null);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    setBusy(true);
    try {
      await onReorder(next.map((r) => r.id));
    } catch {
      setOrder(rows); // save failed — show the last known server order again
    } finally {
      setBusy(false);
    }
  };

  return (
    <table className={`tbl${busy ? " tbl--saving" : ""}`}>
      <thead>
        <tr>
          <th className="tbl__grip" title="Drag to reorder" aria-label="Reorder" />
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {order.map((r) => (
          <tr
            key={r.id}
            className={`${dragId === r.id ? "is-dragging " : ""}${overId === r.id && dragId && dragId !== r.id ? "is-over" : ""}`.trim()}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragId && dragId !== r.id) setOverId(r.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              drop(r.id);
            }}
          >
            <td className="tbl__grip">
              <span
                className="tbl__grip-handle"
                draggable={!busy}
                title="Drag to reposition"
                onDragStart={(e) => {
                  setDragId(r.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", r.id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                aria-hidden
              >
                ⠿
              </span>
            </td>
            {r.cells.map((c, i) => (
              <td key={i}>{c}</td>
            ))}
          </tr>
        ))}
        {!order.length && (
          <tr>
            <td colSpan={headers.length + 1} className="tbl__empty">
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
