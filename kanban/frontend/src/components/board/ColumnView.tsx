"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AddCardDialog } from "@/components/board/AddCardDialog";
import { EditableText } from "@/components/board/EditableText";
import { SortableCardItem } from "@/components/board/SortableCardItem";
import { Badge } from "@/components/ui/badge";
import type { ColumnId } from "@/lib/boardTypes";
import { cn } from "@/lib/utils";
import { useBoardStore } from "@/store/boardStore";

type Props = {
  columnId: ColumnId;
  className?: string;
};

export function ColumnView({ columnId, className }: Props) {
  const column = useBoardStore((s) => s.columns.find((c) => c.id === columnId)!);
  const renameColumn = useBoardStore((s) => s.renameColumn);
  const allCards = useBoardStore((s) => s.cards);
  const cards = React.useMemo(
    () =>
      allCards
        .filter((c) => c.columnId === columnId)
        .slice()
        .sort((a, b) => a.position - b.position),
    [allCards, columnId],
  );
  const cardIds = React.useMemo(() => cards.map((c) => c.id), [cards]);

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: "column", columnId },
  });

  return (
    <section
      data-testid={`column-${columnId}`}
      className={cn(
        "flex min-h-[24rem] flex-col rounded-2xl border border-black/10 bg-white/60 p-3 shadow-sm backdrop-blur",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <EditableText
            value={column.name}
            onChange={(next) => renameColumn(columnId, next)}
            className="font-semibold text-[color:var(--kanban-dark-navy)]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-full bg-white/80 text-[color:var(--kanban-gray-text)] shadow-sm"
          >
            {cards.length}
          </Badge>
          <AddCardDialog columnId={columnId} />
        </div>
      </header>

      <div
        ref={setNodeRef}
        data-testid={`column-drop-${columnId}`}
        className={cn(
          "mt-3 flex flex-1 flex-col gap-2 rounded-xl p-1 transition-colors",
          isOver && "bg-[color:var(--kanban-accent-yellow)]/10",
        )}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCardItem key={card.id} card={card} />
          ))}
        </SortableContext>

        {cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-black/10 bg-white/40 p-6 text-center text-sm text-[color:var(--kanban-gray-text)]">
            Drag a card here, or add one.
          </div>
        ) : null}
      </div>
    </section>
  );
}

