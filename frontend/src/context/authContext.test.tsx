import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "./authContext";
import axios from "../services/axios";
import { jwtDecode } from "jwt-decode";
import userEvent from "@testing-library/user-event";

vi.mock("../services/axios");
vi.mock("jwt-decode");

const mockTokens = {
  access: "access-token",
  refresh: "refresh-token",
};

const mockDecoded = {
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
  user_id: 1,
  username: "testuser",
};

const TestComponent = () => {
  const { user, token, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="username">{user?.username || "Guest"}</div>
      <div data-testid="token">{token || "NoToken"}</div>
      <button onClick={() => login("testuser", "pass")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (jwtDecode as any).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      user_id: 1,
      username: "testuser",
    });
    (axios as any).mockReturnValue({
      post: vi.fn(),
    });
  });

  it("renders with no user by default", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("username")).toHaveTextContent("Guest");
    expect(screen.getByTestId("token")).toHaveTextContent("NoToken");
  });

  it("logs in and stores tokens", async () => {
    (axios.post as any).mockResolvedValueOnce({ data: mockTokens });
    (jwtDecode as any).mockReturnValueOnce(mockDecoded);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("testuser");
      expect(screen.getByTestId("token")).toHaveTextContent("access-token");
    });

    expect(localStorage.getItem("tokens")).toContain("access-token");
  });

  it("logs out and clears tokens", async () => {
    localStorage.setItem("tokens", JSON.stringify(mockTokens));
    (jwtDecode as any).mockReturnValueOnce(mockDecoded);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("testuser");
    });

    userEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent("Guest");
      expect(screen.getByTestId("token")).toHaveTextContent("NoToken");
    });

    expect(localStorage.getItem("tokens")).toBeNull();
  });
});
