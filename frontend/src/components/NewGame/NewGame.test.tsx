import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewGame from "./NewGame";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/api", () => ({
  gameApi: {
    createGame: vi.fn(),
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

describe("NewGame Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <NewGame />
      </MemoryRouter>
    );

  it("renders all inputs and the submit button", () => {
    setup();
    expect(screen.getByTestId("width-input")).toBeInTheDocument();
    expect(screen.getByTestId("height-input")).toBeInTheDocument();
    expect(screen.getByTestId("mines-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("allows updating input values", () => {
    setup();

    fireEvent.change(screen.getByTestId("width-input"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByTestId("height-input"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByTestId("mines-input"), {
      target: { value: "25" },
    });

    expect(screen.getByTestId("width-input")).toHaveValue(15);
    expect(screen.getByTestId("height-input")).toHaveValue(20);
    expect(screen.getByTestId("mines-input")).toHaveValue(25);
  });

  it("calls gameApi and navigates on successful game creation", async () => {
    (gameApi.createGame as any).mockResolvedValueOnce({
      game_id: "1234",
    });

    setup();

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(gameApi.createGame).toHaveBeenCalledWith({
        width: 10,
        height: 10,
        mines_count: 10,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/game/1234");
    });
  });

  it("shows error message if game creation fails", async () => {
    (gameApi.createGame as any).mockRejectedValueOnce(new Error("Failed"));

    setup();

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Error creating game")).toBeInTheDocument();
    });
  });
});
