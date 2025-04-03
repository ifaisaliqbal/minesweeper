import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopNotification } from "./TopNotification";

describe("TopNotification component", () => {
  it("renders the container even without message", () => {
    render(<TopNotification />);
    const container = screen.getByTestId("top-notification");
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render message div if message is not provided", () => {
    render(<TopNotification type="success" />);
    const container = screen.getByTestId("top-notification");
    expect(container.querySelector("div")?.textContent).toBeFalsy();
  });

  it("renders message with success styling", () => {
    render(<TopNotification message="Operation successful" type="success" />);
    const messageEl = screen.getByText("Operation successful");
    expect(messageEl).toBeInTheDocument();
    expect(messageEl).toHaveClass("bg-green-500");
  });

  it("renders message with failure styling", () => {
    render(<TopNotification message="Something went wrong" type="failure" />);
    const messageEl = screen.getByText("Something went wrong");
    expect(messageEl).toBeInTheDocument();
    expect(messageEl).toHaveClass("bg-red-600");
  });

  it("renders with default failure styling if type is not provided", () => {
    render(<TopNotification message="Fallback error" />);
    const messageEl = screen.getByText("Fallback error");
    expect(messageEl).toHaveClass("bg-red-600");
  });
});
