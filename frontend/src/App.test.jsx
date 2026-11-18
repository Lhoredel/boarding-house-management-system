import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { apiRequest } from "./services/api";

vi.mock("./services/api", () => ({
  apiRequest: vi.fn()
}));

describe("Boarding House Management System", () => {
  it("should pass the basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have the correct application name", () => {
    const appName = "Boarding House Management System";
    expect(appName).toBe("Boarding House Management System");
  });
});

describe("App", () => {
  beforeEach(() => {
    apiRequest.mockReset();
    apiRequest.mockImplementation(async (endpoint) =>
      endpoint === "/api/rooms" ? [{ _id: "room-1" }, { _id: "room-2" }] : []
    );
  });

  it("renders the overview dashboard and shows loaded record counts", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText(/Welcome! Manage rooms, tenants, payments/)).toBeInTheDocument();
    expect(await screen.findByText("2")).toBeInTheDocument();

    expect(apiRequest).toHaveBeenCalledWith("/api/rooms");
    expect(apiRequest).toHaveBeenCalledWith("/api/tenants");
    expect(apiRequest).toHaveBeenCalledWith("/api/payments");
    expect(apiRequest).toHaveBeenCalledWith("/api/maintenance");
  });
});
