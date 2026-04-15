import { create } from "zustand";
import type { Card, Column, ColumnId } from "@/lib/boardTypes";
import { createSeedBoard } from "@/lib/seed";

type AddCardInput = {
  columnId: ColumnId;
  title: string;
  details: string;
};

type MoveCardInput = {
  cardId: string;
  toColumnId: ColumnId;
};

type BoardState = {
  columns: Column[];
  cards: Card[];
  renameColumn: (columnId: ColumnId, name: string) => void;
  addCard: (input: AddCardInput) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (input: MoveCardInput) => void;
};

function nextPosition(cards: Card[], columnId: ColumnId) {
  let max = -1;
  for (const c of cards) if (c.columnId === columnId) max = Math.max(max, c.position);
  return max + 1;
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2);
}

const seed = createSeedBoard();

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: seed.columns,
  cards: seed.cards,

  renameColumn: (columnId, name) => {
    const trimmed = name.trim();
    set((s) => ({
      columns: s.columns.map((c) => (c.id === columnId ? { ...c, name: trimmed || c.name } : c)),
    }));
  },

  addCard: ({ columnId, title, details }) => {
    const t = title.trim();
    if (!t) return;
    const d = details.trim();
    const position = nextPosition(get().cards, columnId);
    const card: Card = {
      id: `card_${newId()}`,
      columnId,
      title: t,
      details: d,
      position,
    };
    set((s) => ({ cards: [...s.cards, card] }));
  },

  deleteCard: (cardId) => {
    set((s) => ({ cards: s.cards.filter((c) => c.id !== cardId) }));
  },

  moveCard: ({ cardId, toColumnId }) => {
    set((s) => {
      const position = nextPosition(s.cards, toColumnId);
      return {
        cards: s.cards.map((c) =>
          c.id === cardId ? { ...c, columnId: toColumnId, position } : c,
        ),
      };
    });
  },
}));

