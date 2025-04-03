import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import Game from "./Game";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../services/api", () => ({
  gameApi: {
    getGameState: vi.fn(),
    takeAction: vi.fn(),
  },
}));
vi.mock("../../constants", () => ({
  GameActions: {
    REVEAL: "reveal",
    FLAG: "flag",
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { gameApi } from "../../services/api";

const mockGameState = {
  board: [
    [0, 0],
    [0, 0],
  ],
  revealed: [
    [false, false],
    [false, false],
  ],
  flagged: [
    [false, false],
    [false, false],
  ],
  width: 2,
  height: 2,
  mines_count: 2,
  is_over: false,
  is_won: false,
};

describe("Game component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (initialRoute = "/game/test-id") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("shows loading state initially", async () => {
    (gameApi.getGameState as any).mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders game board after successful fetch", async () => {
    (gameApi.getGameState as any).mockResolvedValueOnce(mockGameState);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId("mines_count")).toHaveTextContent("Mines: 2");
      expect(screen.getByTestId("board-component")).toBeInTheDocument();
      expect(screen.getByTestId("start-go-back-button")).toBeInTheDocument();
    });
  });

  it("shows win message when game is won", async () => {
    const wonState = { ...mockGameState, is_over: true, is_won: true };
    (gameApi.getGameState as any).mockResolvedValueOnce(wonState);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("🎉 You Won the Game!")).toBeInTheDocument();
      expect(screen.getByText("Start New Game")).toBeInTheDocument();
    });
  });

  it("shows lose message when game is lost", async () => {
    const lostState = { ...mockGameState, is_over: true, is_won: false };
    (gameApi.getGameState as any).mockResolvedValueOnce(lostState);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("💥 You Lost the Game!")).toBeInTheDocument();
      expect(screen.getByText("Start New Game")).toBeInTheDocument();
    });
  });

  it('navigates to home on "Start New Game" if game is over', async () => {
    const finishedGame = { ...mockGameState, is_over: true };
    (gameApi.getGameState as any).mockResolvedValueOnce(finishedGame);

    renderWithRouter();

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("start-go-back-button"));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("asks for confirmation before navigating away if game is not over", async () => {
    window.confirm = vi.fn(() => true);
    (gameApi.getGameState as any).mockResolvedValueOnce(mockGameState);

    renderWithRouter();

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("start-go-back-button"));
    });

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to go back?"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("cancels navigation if user denies confirmation", async () => {
    window.confirm = vi.fn(() => false);
    (gameApi.getGameState as any).mockResolvedValueOnce(mockGameState);

    renderWithRouter();

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("start-go-back-button"));
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
