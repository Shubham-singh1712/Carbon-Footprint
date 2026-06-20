import {
  Bot,
  Gauge,
  Globe,
  LineChart,
  Receipt,
  Sparkles,
  Trophy,
} from "lucide-react";

export const platformNavigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Gauge,
  },
  {
    href: "/ai-coach",
    label: "AI Carbon Coach",
    icon: Bot,
  },
  {
    href: "/receipt-scanner",
    label: "Receipt Scanner",
    icon: Receipt,
  },
  {
    href: "/simulator",
    label: "What-If Simulator",
    icon: Sparkles,
  },
  {
    href: "/forecast",
    label: "Forecast Analytics",
    icon: LineChart,
  },
  {
    href: "/challenges",
    label: "Challenges",
    icon: Trophy,
  },
  {
    href: "/impact",
    label: "Impact Center",
    icon: Globe,
  },
] as const;
