import type { Card, Column } from "@/lib/boardTypes";

export function createSeedBoard(): { columns: Column[]; cards: Card[] } {
  const columns: Column[] = [
    { id: "backlog", name: "Backlog" },
    { id: "todo", name: "Planned" },
    { id: "inProgress", name: "In Progress" },
    { id: "review", name: "Review" },
    { id: "done", name: "Done" },
  ];

  const cards: Card[] = [
    {
      id: "card_seed_1",
      columnId: "backlog",
      position: 0,
      title: "Polish the board UI",
      details: "Refine spacing, typography, and hover states for a premium feel.",
    },
    {
      id: "card_seed_2",
      columnId: "backlog",
      position: 1,
      title: "Add drag overlay",
      details: "Ensure dragging feels smooth and cards don’t jump during interactions.",
    },
    {
      id: "card_seed_3",
      columnId: "todo",
      position: 0,
      title: "Seed dummy data",
      details: "Board should open with example cards across multiple columns.",
    },
    {
      id: "card_seed_4",
      columnId: "inProgress",
      position: 0,
      title: "Implement add/delete",
      details: "Add a new card with title and details; delete existing cards.",
    },
    {
      id: "card_seed_5",
      columnId: "review",
      position: 0,
      title: "Write Playwright tests",
      details: "Cover smoke, rename, add/delete, and drag/drop between columns.",
    },
    {
      id: "card_seed_6",
      columnId: "done",
      position: 0,
      title: "Pick a color palette",
      details:
        "Accent #ecad0a, primary #209dd7, secondary #753991, headings #032147, text #888888.",
    },
  ];

  return { columns, cards };
}

