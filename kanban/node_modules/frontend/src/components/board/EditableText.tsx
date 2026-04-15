"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  inputClassName?: string;
};

export function EditableText({ value, onChange, className, inputClassName }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [isEditing, value]);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function commit() {
    setIsEditing(false);
    onChange(draft);
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={cn(
          "group inline-flex max-w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kanban-accent-yellow)]",
          className,
        )}
        title="Rename column"
      >
        <span className="truncate">{value}</span>
        <span className="text-xs text-[color:var(--kanban-gray-text)] opacity-0 transition-opacity group-hover:opacity-100">
          Edit
        </span>
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setIsEditing(false);
        }
      }}
      className={cn(
        "h-8 w-full rounded-md border border-black/10 bg-white px-2 text-sm font-medium text-[color:var(--kanban-dark-navy)] shadow-sm outline-none focus:ring-2 focus:ring-[color:var(--kanban-accent-yellow)]",
        inputClassName,
      )}
      aria-label="Rename column"
    />
  );
}

