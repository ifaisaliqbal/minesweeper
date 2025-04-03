import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "./Login";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useAuth } from "../../context/authContext";

describe("Login Component", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
    });
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  it("renders username and password inputs and login button", () => {
    setup();

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("calls login and navigates on successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    setup();

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser", "password");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error notification on failed login", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    setup();

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "wronguser" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        screen.getByText("Username or password is incorrect")
      ).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("shows spinner while logging in", async () => {
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });

    mockLogin.mockReturnValueOnce(loginPromise);

    setup();

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    resolveLogin!();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
