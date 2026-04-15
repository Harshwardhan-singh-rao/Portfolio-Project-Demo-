import { describe, expect, it, beforeEach } from "vitest";
import { useBoardStore } from "@/store/boardStore";
import { createSeedBoard } from "@/lib/seed";

beforeEach(() => {
  const seed = createSeedBoard();
  useBoardStore.setState((s) => ({ ...s, ...seed }));
});

describe("board store", () => {
  it("initializes with 5 columns and seeded cards", () => {
    const { columns, cards } = useBoardStore.getState();
    expect(columns).toHaveLength(5);
    expect(cards.length).toBeGreaterThan(0);
  });

  it("renames a column", () => {
    const { renameColumn } = useBoardStore.getState();
    renameColumn("todo", "Up next");
    expect(useBoardStore.getState().columns.find((c) => c.id === "todo")?.name).toBe("Up next");
  });

  it("adds and deletes a card", () => {
    const { addCard, deleteCard } = useBoardStore.getState();
    addCard({ columnId: "todo", title: "New card", details: "Details" });
    const added = useBoardStore.getState().cards.find((c) => c.title === "New card");
    expect(added).toBeTruthy();

    deleteCard(added!.id);
    expect(useBoardStore.getState().cards.some((c) => c.id === added!.id)).toBe(false);
  });

  it("moves a card between columns", () => {
    const { cards, moveCard } = useBoardStore.getState();
    const card = cards[0]!;
    const from = card.columnId;
    const to = from === "done" ? "backlog" : "done";

    moveCard({ cardId: card.id, toColumnId: to });
    const moved = useBoardStore.getState().cards.find((c) => c.id === card.id)!;
    expect(moved.columnId).toBe(to);
  });
});

