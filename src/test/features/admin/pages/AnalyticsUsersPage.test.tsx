import { describe, expect, it } from "vitest";
import { AnalyticsUsersPage } from "@/features/admin/pages/AnalyticsUsersPage";
import { render, screen } from "@/test/test-utils";

describe("AnalyticsUsersPage", () => {
  it("renders the page title and description", () => {
    render(<AnalyticsUsersPage />);

    expect(screen.getByText("User Analytics")).toBeInTheDocument();
    expect(
      screen.getByText(/User growth, demographics, and plan distribution/i),
    ).toBeInTheDocument();
  });

  it("renders all KPI stat cards with correct values", () => {
    render(<AnalyticsUsersPage />);
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("4,820")).toBeInTheDocument();

    expect(screen.getByText("New Signups")).toBeInTheDocument();
    expect(screen.getByText("347")).toBeInTheDocument();

    expect(screen.getByText("Churn Rate")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();

    expect(screen.getByText("Active Rate")).toBeInTheDocument();
    expect(screen.getByText("68.5")).toBeInTheDocument();
  });

  it("renders the main charts sections", () => {
    render(<AnalyticsUsersPage />);

    expect(screen.getByText("Signups Overview")).toBeInTheDocument();
    expect(screen.getByText("Plan Distribution")).toBeInTheDocument();
    expect(screen.getByText("Age Demographics")).toBeInTheDocument();
  });
});
