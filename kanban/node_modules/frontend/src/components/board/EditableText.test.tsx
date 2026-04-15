import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EditableText } from "@/components/board/EditableText";

describe("EditableText", () => {
  it("commits changes on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<EditableText value="Backlog" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /backlog/i }));
    const input = screen.getByRole("textbox", { name: /rename column/i });
    await user.clear(input);
    await user.type(input, "Up next{enter}");

    expect(onChange).toHaveBeenCalledWith("Up next");
  });
});

