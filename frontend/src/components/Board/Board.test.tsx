import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Board } from "./Board";
import { GameState } from "../../types";

describe("Board component", () => {
  const onCellClick = vi.fn();
  const onCellRightClick = vi.fn();

  const mockGameState: GameState = {
    width: 2,
    height: 2,
    board: [
      [0, -1],
      [1, 2],
    ],
    revealed: [
      [false, false],
      [true, true],
    ],
    flagged: [
      [false, true],
      [false, false],
    ],
    game_id: "",
    is_over: false,
    is_won: false,
    mines_count: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBoard = () =>
    render(
      <Board
        gameState={mockGameState}
        onCellClick={onCellClick}
        onCellRightClick={onCellRightClick}
      />
    );

  it("renders the board container", () => {
    renderBoard();
    expect(screen.getByTestId("board")).toBeInTheDocument();
  });

  it("renders the correct number of cells", () => {
    renderBoard();
    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(4);
  });

  it("renders the correct cell contents based on game state", () => {
    renderBoard();
    const cells = screen.getAllByTestId("cell");

    expect(cells[0]).toHaveTextContent("");
    expect(cells[1]).toHaveTextContent("🚩");
    expect(cells[2]).toHaveTextContent("1");
    expect(cells[3]).toHaveTextContent("2");
  });

  it("calls onCellClick with correct coordinates when a cell is clicked", () => {
    renderBoard();
    const cells = screen.getAllByTestId("cell");

    fireEvent.click(cells[0]);
    fireEvent.click(cells[3]);

    expect(onCellClick).toHaveBeenCalledWith(0, 0);
    expect(onCellClick).toHaveBeenCalledWith(1, 1);
  });

  it("calls onCellRightClick with correct coordinates when a cell is right-clicked", () => {
    renderBoard();
    const cells = screen.getAllByTestId("cell");

    fireEvent.contextMenu(cells[1]);
    fireEvent.contextMenu(cells[2]);

    expect(onCellRightClick).toHaveBeenCalledTimes(2);
    expect(onCellRightClick.mock.calls[0][1]).toBe(1);
    expect(onCellRightClick.mock.calls[0][2]).toBe(0);

    expect(onCellRightClick.mock.calls[1][1]).toBe(0);
    expect(onCellRightClick.mock.calls[1][2]).toBe(1);
  });
});
