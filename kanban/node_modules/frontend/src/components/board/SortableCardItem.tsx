"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/lib/boardTypes";
import { cn } from "@/lib/utils";
import { CardItem } from "@/components/board/CardItem";

type Props = {
  card: Card;
};

export function SortableCardItem({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", columnId: card.columnId },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className={cn(isDragging && "opacity-50")}
      {...attributes}
      {...listeners}
    >
      <CardItem card={card} />
    </div>
  );
}

