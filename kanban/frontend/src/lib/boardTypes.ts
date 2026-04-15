export const columnIds = [
  "backlog",
  "todo",
  "inProgress",
  "review",
  "done",
] as const;

export type ColumnId = (typeof columnIds)[number];

export type Column = {
  id: ColumnId;
  name: string;
};

export type Card = {
  id: string;
  columnId: ColumnId;
  title: string;
  details: string;
  position: number;
};

