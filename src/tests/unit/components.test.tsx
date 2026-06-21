import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Mock framer motion to avoid transition lags/exceptions inside JSDOM
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }: React.SVGProps<SVGCircleElement>) => <circle {...props}>{children}</circle>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock recharts to avoid responsive wrapper/rendering exceptions inside JSDOM
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}));

// Mock active user profile data store
const mockProfile = {
  transport: { commuteDistanceKm: 15, vehicleType: "car-petrol" as const, publicTransportDays: 1 },
  home: { electricityKwh: 300, applianceUsage: "moderate" as const },
  food: { dietType: "omnivore" as const, meatMealsPerWeek: 5 },
  travel: { flightsPerYear: 2, trainTripsPerYear: 4 },
  shopping: { monthlySpend: 5000 },
};

vi.mock("@/stores/user-profile", () => ({
  useUserProfile: (selector: (state: { profile: typeof mockProfile; onboardingComplete: boolean }) => unknown) => selector({
    profile: mockProfile,
    onboardingComplete: true,
  }),
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: { queryKey: string[] }) => {
    if (options.queryKey[0] === "platform-overview") {
      return {
        data: {
          healthScore: 78,
          summary: [
            { label: "Transport emissions", value: 120, suffix: "kg", delta: -12 },
            { label: "Home energy footprint", value: 85, suffix: "kg", delta: 5 },
          ],
          trend: [
            { period: "Jan", actual: 250, target: 200 },
          ],
          breakdown: [
            { category: "Transport", value: 45 },
          ],
          milestones: [
            { title: "Eco-Warrior", detail: "Save 100kg CO2", progress: 80 },
          ],
          coachBrief: "Switch commute mode to public transport.",
        },
        isLoading: false,
      };
    }
    if (options.queryKey[0] === "impact-center") {
      return {
        data: {
          treesEquivalent: 47,
          waterSavedLitres: 18600,
          energySavedKwh: 520,
          totalReductionKg: 986,
          communityRank: 142,
          totalMembers: 8900,
          reductionHistory: [{ month: "Jan", reduction: 42 }],
          milestones: [{ title: "First 100 kg reduced", value: "100 kg CO2", achieved: true }],
        },
        isLoading: false,
      };
    }
    return { data: null, isLoading: true };
  },
}));

// Mock custom hooks
vi.mock("@/hooks/use-sustainability", () => ({
  useCommunityImpact: () => ({
    data: {
      treesEquivalent: 47,
      waterSavedLitres: 18600,
      energySavedKwh: 520,
      totalReductionKg: 986,
      communityRank: 142,
      totalMembers: 8900,
    },
    isLoading: false,
    isError: false,
  }),
}));

// Imports of components to test
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { CommunityImpactCard } from "@/features/dashboard/components/dashboard-overview";
import { ReductionRoadmap } from "@/features/coach/components/reduction-roadmap";
import { BehavioralInsights } from "@/features/coach/components/behavioral-insights";
import { CarbonScoreCard } from "@/features/dashboard/components/carbon-score-card";

describe("Component Unit & Accessibility Tests", () => {
  describe("CarbonScoreCard", () => {
    it("renders score and text details successfully", () => {
      render(<CarbonScoreCard score={75} />);
      expect(screen.getByText("Carbon Health Score")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("Good")).toBeInTheDocument();
      expect(screen.getByText("You're performing above average!")).toBeInTheDocument();
    });

    it("displays corrective feedback for low scores", () => {
      render(<CarbonScoreCard score={30} />);
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Room for improvement — check AI Coach.")).toBeInTheDocument();
    });

    it("has accessible roles and labels", () => {
      render(<CarbonScoreCard score={85} />);
      const svgElement = screen.getByRole("img");
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute("aria-label", "Carbon Health Score: 85 out of 100, rated Excellent");
    });
  });

  describe("CommunityImpactCard", () => {
    it("renders carbon saved and equivalent sub-metrics", () => {
      render(<CommunityImpactCard />);
      expect(screen.getByText("Community Impact")).toBeInTheDocument();
      expect(screen.getByText("986 kg CO₂e Saved")).toBeInTheDocument();
      expect(screen.getByText("Rank #142")).toBeInTheDocument();
      
      // Check 4 equivalents
      expect(screen.getByText("47")).toBeInTheDocument();
      expect(screen.getByText("Trees Saved")).toBeInTheDocument();
      expect(screen.getByText("18,600 L")).toBeInTheDocument();
      expect(screen.getByText("Water Saved")).toBeInTheDocument();
      expect(screen.getByText("520 kWh")).toBeInTheDocument();
      expect(screen.getByText("Energy Saved")).toBeInTheDocument();
      expect(screen.getByText("118,795")).toBeInTheDocument();
      expect(screen.getByText("Phone Charges")).toBeInTheDocument();
    });

    it("displays community membership metrics", () => {
      render(<CommunityImpactCard />);
      expect(screen.getByText("Jointly offset by 8,900 community members")).toBeInTheDocument();
    });
  });

  describe("BehavioralInsights", () => {
    it("renders hotspots, opportunities, and explainability layer details", () => {
      render(<BehavioralInsights />);
      expect(screen.getByText("Behavioral Insights & Explainability")).toBeInTheDocument();
      expect(screen.getByText("AI explainability & hotspots")).toBeInTheDocument();
      expect(screen.getByText("Explainability Layer")).toBeInTheDocument();
      
      // Verify explainability copy exists
      expect(screen.getByText("Why Generated:")).toBeInTheDocument();
      expect(screen.getByText("Data Influenced:")).toBeInTheDocument();
    });
  });

  describe("ReductionRoadmap", () => {
    it("renders plan details and supports accordion clicks", () => {
      render(<ReductionRoadmap />);
      expect(screen.getByText("30-Day AI Reduction Plan")).toBeInTheDocument();
      expect(screen.getByText("Your carbon reduction roadmap")).toBeInTheDocument();
      
      // Default open is Week 1
      expect(screen.getByText("Swap two single-occupant car driving days with public transport.")).toBeInTheDocument();
      
      // Click Week 2 button to expand
      const week2Button = screen.getByText("Plant-Forward Swaps");
      fireEvent.click(week2Button);
      
      // Verify Week 2 description shows up
      expect(screen.getByText("Replace two weekly red-meat dinner meals with seasonal plant-based dishes.")).toBeInTheDocument();
    });
  });

  describe("DashboardOverview", () => {
    it("renders all sub-sections of the dashboard correctly", () => {
      render(<DashboardOverview />);
      // Title header of sections
      expect(screen.getByText("Carbon Health Score")).toBeInTheDocument();
      expect(screen.getByText("Emission Trend")).toBeInTheDocument();
      expect(screen.getByText("Impact Mix")).toBeInTheDocument();
      expect(screen.getByText("Active Milestones")).toBeInTheDocument();
      expect(screen.getByText("Carbon Coach Brief")).toBeInTheDocument();
    });
  });
});
