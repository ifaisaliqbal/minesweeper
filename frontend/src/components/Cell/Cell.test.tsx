import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Cell } from "./Cell";

describe("Cell", () => {
  const onClickMock = vi.fn();
  const onContextMenuMock = vi.fn();

  const renderCell = (props = {}) =>
    render(
      <Cell
        revealed={false}
        flagged={false}
        value={0}
        onClick={onClickMock}
        onContextMenu={onContextMenuMock}
        {...props}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an empty hidden cell by default", () => {
    renderCell();
    const cell = screen.getByTestId("cell");
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveTextContent("");
    expect(cell).toHaveClass("bg-[#616060]");
  });

  it("renders a flag when flagged", () => {
    renderCell({ flagged: true });
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveTextContent("🚩");
  });

  it("renders a bomb when revealed and value is -1", () => {
    renderCell({ revealed: true, value: -1 });
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveTextContent("💣");
    expect(cell).toHaveClass("bg-white");
  });

  it("renders a number when revealed and value > 0", () => {
    renderCell({ revealed: true, value: 2 });
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveTextContent("2");
    expect(cell).toHaveClass("bg-white");
  });

  it("renders empty when revealed and value is 0", () => {
    renderCell({ revealed: true, value: 0 });
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveTextContent("");
    expect(cell).toHaveClass("bg-white");
  });

  it("calls onClick when clicked", () => {
    renderCell();
    const cell = screen.getByTestId("cell");
    fireEvent.click(cell);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("calls onContextMenu when right-clicked", () => {
    renderCell();
    const cell = screen.getByTestId("cell");
    fireEvent.contextMenu(cell);
    expect(onContextMenuMock).toHaveBeenCalled();
  });
});
