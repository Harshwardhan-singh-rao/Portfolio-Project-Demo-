"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ColumnView } from "@/components/board/ColumnView";
import { CardItem } from "@/components/board/CardItem";
import { useBoardStore } from "@/store/boardStore";

export function BoardView() {
  const columns = useBoardStore((s) => s.columns);
  const cards = useBoardStore((s) => s.cards);
  const moveCard = useBoardStore((s) => s.moveCard);
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeCard = React.useMemo(
    () => (activeCardId ? cards.find((c) => c.id === activeCardId) ?? null : null),
    [activeCardId, cards],
  );

  return (
    <div className="flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(32,157,215,0.06),rgba(236,173,10,0.04)_35%,transparent_85%)]">
      <header className="mx-auto w-full max-w-7xl px-6 pt-10 pb-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-wide text-[color:var(--kanban-gray-text)]">
              Single board
            </p>
            <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight text-[color:var(--kanban-dark-navy)]">
              Kanban
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-[color:var(--kanban-gray-text)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--kanban-blue-primary)]" />
            Client-only, no persistence
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl flex-1 px-6 pb-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToWindowEdges]}
          onDragStart={(e) => {
            setActiveCardId(String(e.active.id));
          }}
          onDragCancel={() => setActiveCardId(null)}
          onDragEnd={(e) => {
            setActiveCardId(null);
            const activeId = String(e.active.id);
            const overId = e.over?.id ? String(e.over.id) : null;
            if (!overId) return;

            const activeColumnId = e.active.data.current?.columnId;
            const overColumnId =
              e.over?.data.current?.type === "column"
                ? e.over.data.current.columnId
                : e.over?.data.current?.columnId;

            if (!activeColumnId || !overColumnId) return;
            if (activeColumnId === overColumnId) return;

            moveCard({ cardId: activeId, toColumnId: overColumnId });
          }}
        >
          <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {columns.map((c) => (
              <ColumnView key={c.id} columnId={c.id} />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="w-[18.5rem]">
                <CardItem card={activeCard} className="shadow-lg" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </section>
    </div>
  );
}

