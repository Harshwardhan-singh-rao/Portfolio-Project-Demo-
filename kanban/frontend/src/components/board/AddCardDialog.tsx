"use client";

import * as React from "react";
import type { ColumnId } from "@/lib/boardTypes";
import { useBoardStore } from "@/store/boardStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  columnId: ColumnId;
};

export function AddCardDialog({ columnId }: Props) {
  const addCard = useBoardStore((s) => s.addCard);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [details, setDetails] = React.useState("");

  function submit() {
    addCard({ columnId, title, details });
    setTitle("");
    setDetails("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-2 rounded-full border border-black/10 bg-white/80 text-[color:var(--kanban-dark-navy)] shadow-sm hover:bg-white"
          />
        }
      >
        <span className="text-[color:var(--kanban-purple-secondary)]">+</span>
        Add
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--kanban-dark-navy)]">New card</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <label
              htmlFor="new-card-title"
              className="text-sm font-medium text-[color:var(--kanban-gray-text)]"
            >
              Title
            </label>
            <Input
              id="new-card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short and specific"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="new-card-details"
              className="text-sm font-medium text-[color:var(--kanban-gray-text)]"
            >
              Details
            </label>
            <Textarea
              id="new-card-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Optional context..."
              rows={5}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-[color:var(--kanban-gray-text)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submit}
              className="bg-[color:var(--kanban-purple-secondary)] text-white hover:bg-[color:var(--kanban-purple-secondary)]/90"
              disabled={!title.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

