"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Card } from "@/lib/boardTypes";
import { useBoardStore } from "@/store/boardStore";
import { Button } from "@/components/ui/button";

type Props = {
  card: Card;
  className?: string;
};

export function CardItem({ card, className }: Props) {
  const deleteCard = useBoardStore((s) => s.deleteCard);
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <article
      data-testid={`card-body-${card.id}`}
      className={cn(
        "group relative rounded-xl border border-black/10 bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[color:var(--kanban-dark-navy)]">
            {card.title}
          </h3>
          {card.details ? (
            <p className="mt-1 line-clamp-3 text-sm leading-5 text-[color:var(--kanban-gray-text)]">
              {card.details}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => deleteCard(card.id)}
          data-testid={`delete-card-${card.id}`}
          className={cn(
            "h-8 w-8 rounded-full text-[color:var(--kanban-gray-text)] hover:bg-black/5 hover:text-black",
            isHovering ? "opacity-100" : "opacity-0",
          )}
          aria-label="Delete card"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

