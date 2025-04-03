import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../context/authContext";

describe("Navbar component", () => {
  it("shows login/signup links when user is not logged in", () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(screen.getByTestId("signup-link")).toBeInTheDocument();
    expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });

  it("shows welcome message and logout button when user is logged in", () => {
    const mockLogout = vi.fn();

    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome, testuser!")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.queryByTestId("login-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signup-link")).not.toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    const mockLogout = vi.fn();

    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("logout-button"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
