"use client";

import dynamic from "next/dynamic";

const BoardView = dynamic(() => import("@/components/board/BoardView").then((m) => m.BoardView), {
  ssr: false,
});

export function BoardClient() {
  return <BoardView />;
}

