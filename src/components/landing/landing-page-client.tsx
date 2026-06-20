"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  Leaf,
  LineChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Waves,
  Zap,
  Target,
  BarChart3,
  Users,
  TreePine,
  Droplets,
  Quote,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Accordion } from "@/components/shared/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  hoverLift,
} from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const featureCards = [
  {
    icon: Bot,
    title: "AI Carbon Coach",
    description:
      "Personalized weekly plans that translate habits, purchases, and travel into carbon-lighter decisions.",
  },
  {
    icon: LineChart,
    title: "Carbon Forecasting",
    description:
      "Predict upcoming footprint patterns and see which interventions bend the curve fastest.",
  },
  {
    icon: ReceiptText,
    title: "Receipt Scanner",
    description:
      "Turn everyday receipts into category-level CO2e estimates with confidence scoring.",
  },
  {
    icon: Sparkles,
    title: "What-If Simulator",
    description:
      "Model commute, diet, shopping, and home changes before committing to a new target.",
  },
];

const stats = [
  { value: 31, suffix: "%", label: "projected annual reduction" },
  { value: 4800, suffix: "", label: "kg CO2e modeled per profile", prefix: "" },
  { value: 95, suffix: "+", label: "target Lighthouse score" },
];

const rings = [
  { label: "Mobility", value: 36, offset: "0", color: "#0f9f6f" },
  { label: "Food", value: 24, offset: "36", color: "#35b98b" },
  { label: "Home", value: 20, offset: "60", color: "#7ccba4" },
  { label: "Shopping", value: 12, offset: "80", color: "#b7dfc7" },
];

const howItWorks = [
  {
    step: "01",
    icon: Target,
    title: "Tell us your lifestyle",
    description:
      "Complete a 5-minute onboarding wizard covering transport, home energy, food habits, travel, and shopping patterns.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Get your Digital Carbon Twin",
    description:
      "Our AI engine builds a personalized model of your carbon footprint with category breakdowns and a health score.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Predict, simulate, reduce",
    description:
      "Forecast future emissions, run what-if scenarios, complete challenges, and track your reduction over time.",
  },
];

const carbonStats = [
  { icon: TreePine, value: 14200, suffix: "+", label: "Trees equivalent saved" },
  { icon: Users, value: 8900, suffix: "+", label: "Profiles modeled" },
  { icon: Droplets, value: 2400000, suffix: "L", label: "Water footprint tracked" },
  { icon: Zap, value: 340000, suffix: "kWh", label: "Energy impact analyzed" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Environmental Scientist",
    quote:
      "CarbonTwin AI replaced three different tools I was using. The forecast engine alone saved me hours of spreadsheet work every month.",
  },
  {
    name: "Arjun Patel",
    role: "Sustainability Lead, TechCorp",
    quote:
      "The what-if simulator changed how our team makes decisions. We can now see the carbon cost of every operational change before committing.",
  },
  {
    name: "Maya Chen",
    role: "Climate Educator",
    quote:
      "My students love the gamification. The challenges and XP system make carbon awareness feel achievable instead of overwhelming.",
  },
];

const faqItems = [
  {
    question: "How accurate are the carbon calculations?",
    answer:
      "CarbonTwin uses emission factors from DEFRA, EPA, and IPCC AR6 guidelines. Each estimate includes a confidence score. While no calculator is perfect, our factors are conservative and regularly updated to reflect the latest climate science.",
  },
  {
    question: "Do I need to connect any accounts or devices?",
    answer:
      "No. CarbonTwin works entirely from information you provide during onboarding and ongoing receipt uploads. We never require access to banking, email, or IoT devices.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All data is stored in Supabase with row-level security. Authentication uses industry-standard Supabase Auth with encrypted tokens. We never sell or share your personal data.",
  },
  {
    question: "Can I use CarbonTwin without creating an account?",
    answer:
      "Yes. The platform runs in demo mode when no authentication is configured, giving you full access to explore features with sample data before committing.",
  },
  {
    question: "How is the Carbon Health Score calculated?",
    answer:
      "Your score (0-100) compares your monthly emissions against the national per-capita average. A score of 75+ means you're performing significantly better than average. The score factors in transport, home energy, food, travel, and shopping.",
  },
  {
    question: "Is CarbonTwin free to use?",
    answer:
      "The platform is open source. You can self-host it for free or use our managed instance. Enterprise features for teams and organizations are planned for a future release.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function LandingPageClient() {
  return (
    <main className="overflow-hidden pb-16">
      <MarketingHeader />

      {/* ────────────────── Hero ────────────────── */}
      <section className="relative min-h-[calc(100vh-96px)] pt-16 sm:pt-20">
        <div className="carbon-particles" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties} />
          ))}
        </div>

        <div className="page-shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge>Premium carbon intelligence</Badge>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              <span className="gradient-headline">Understand.</span>{" "}
              <span className="gradient-headline">Predict.</span>{" "}
              <span className="gradient-headline">Reduce.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Build your Digital Carbon Twin and discover personalized ways to
              reduce your environmental impact through AI coaching, forecasting,
              and simulation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="secondary">
                  Explore platform
                </Button>
              </Link>
            </div>

            <motion.div
              className="mt-10 grid gap-3 sm:grid-cols-3"
              aria-label="CarbonTwin AI platform statistics"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="rounded-lg border border-white/80 bg-white/72 p-4 shadow-[0_18px_60px_-42px_rgba(16,34,26,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-3xl font-semibold text-foreground">
                    {stat.prefix}
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:justify-self-end"
          >
            <div
              className="carbon-visualization relative mx-auto w-full max-w-[560px] rounded-lg border border-white/80 bg-white/74 p-5 shadow-[0_36px_100px_-54px_rgba(16,34,26,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/8 sm:p-6"
              aria-label="Carbon footprint visualization by category"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Live footprint twin
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">
                    18.4 kg CO2e / day
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-white">
                  <Leaf className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr] md:items-center">
                <div className="relative mx-auto aspect-square w-full max-w-60">
                  <svg
                    className="h-full w-full rotate-[-90deg]"
                    viewBox="0 0 120 120"
                    role="img"
                    aria-label="Mobility 36 percent, food 24 percent, home 20 percent, shopping 12 percent"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke="rgba(16,34,26,0.08)"
                      strokeWidth="14"
                    />
                    {rings.map((ring) => (
                      <circle
                        key={ring.label}
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke={ring.color}
                        strokeDasharray={`${ring.value} ${100 - ring.value}`}
                        strokeDashoffset={`-${ring.offset}`}
                        strokeLinecap="round"
                        strokeWidth="14"
                        pathLength="100"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-semibold text-foreground">22%</span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      below baseline
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {rings.map((ring) => (
                    <div
                      key={ring.label}
                      className="rounded-lg border border-white/80 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: ring.color }}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {ring.label}
                          </span>
                        </div>
                        <span className="font-mono text-sm text-muted">
                          {ring.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: CheckCircle2, label: "Target aligned" },
                  { icon: ChartNoAxesCombined, label: "Forecast active" },
                  { icon: ShieldCheck, label: "Typed APIs" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex min-h-16 items-center gap-3 rounded-lg bg-accent-soft px-3 py-3 text-sm font-semibold text-accent-strong"
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="page-shell mt-12">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      </section>

      {/* ────────────────── Features ────────────────── */}
      <section className="page-shell py-16 sm:py-20" id="features">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Badge variant="neutral">Platform modules</Badge>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            One intelligent layer for carbon-aware living.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            Four focused surfaces cover coaching, forecasting, purchase analysis,
            and scenario modeling without adding friction to daily routines.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={staggerItem} {...hoverLift}>
                <Card className="h-full rounded-lg p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-normal text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ────────────────── How It Works ────────────────── */}
      <section className="page-shell py-16 sm:py-20" id="how-it-works">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Badge>Simple workflow</Badge>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Three steps to carbon clarity.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">
            From onboarding to actionable insights in under five minutes.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.step} variants={staggerItem}>
                <Card className="relative h-full overflow-hidden rounded-lg p-6">
                  <span className="absolute right-4 top-4 font-mono text-6xl font-bold text-accent/8">
                    {step.step}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ────────────────── Carbon Statistics ────────────────── */}
      <section className="page-shell py-10 sm:py-14" id="stats">
        <motion.div
          className="rounded-lg border border-white/80 bg-[#10221a] p-6 text-white shadow-[0_30px_100px_-54px_rgba(16,34,26,0.65)] dark:bg-[#0a1510] sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Badge className="bg-white/16 text-white" variant="neutral">
            Platform impact
          </Badge>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Real numbers, real impact.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
            Aggregate impact across all CarbonTwin profiles — and growing every day.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {carbonStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/12 bg-white/8 p-5"
                >
                  <Icon className="h-6 w-6 text-white/70" aria-hidden="true" />
                  <p className="mt-4 text-3xl font-semibold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ────────────────── Testimonials ────────────────── */}
      <section className="page-shell py-16 sm:py-20" id="testimonials">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Badge variant="neutral">What people say</Badge>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Trusted by sustainability leaders.
          </h2>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={staggerItem}>
              <Card className="h-full rounded-lg p-6">
                <Quote className="h-8 w-8 text-accent/20" aria-hidden="true" />
                <p className="mt-4 text-sm leading-7 text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="mt-1 text-xs text-muted">{t.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ────────────────── FAQ ────────────────── */}
      <section className="page-shell py-16 sm:py-20" id="faq">
        <motion.div
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div>
            <Badge>Answers</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Everything you need to know about CarbonTwin AI and how it works.
            </p>
          </div>
          <Accordion items={faqItems} />
        </motion.div>
      </section>

      {/* ────────────────── Quality Highlights ────────────────── */}
      <section className="page-shell py-10 sm:py-14">
        <motion.div
          className="rounded-lg border border-white/80 bg-[#10221a] p-6 text-white shadow-[0_30px_100px_-54px_rgba(16,34,26,0.65)] dark:bg-[#0a1510] sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/12">
                <Waves className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-normal sm:text-4xl">
                Designed for fast, accessible, production-grade sustainability
                teams.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                Semantic markup, visible focus states, responsive sizing,
                lightweight CSS motion, and static-first rendering keep the
                platform ready for high Lighthouse performance.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Accessible contrast",
                "Keyboard-ready CTAs",
                "Static rendered hero",
                "Reduced layout shift",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/12 bg-white/8 px-4 py-4 text-sm font-semibold text-white/86"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ────────────────── CTA ────────────────── */}
      <section className="page-shell py-16 sm:py-20" id="cta">
        <motion.div
          className="rounded-[32px] bg-gradient-to-br from-accent to-accent-strong p-8 text-center text-white sm:p-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Ready to build your Digital Carbon Twin?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            Start your sustainability journey today. Understand your footprint,
            get AI-powered recommendations, and track your progress over time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-white text-accent-strong hover:bg-white/90"
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/15 text-white hover:bg-white/25"
              >
                View demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ────────────────── Footer ────────────────── */}
      <footer className="page-shell py-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">
              <Leaf className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              CarbonTwin AI
            </span>
          </div>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} CarbonTwin AI. Open source sustainability platform.
          </p>
        </div>
      </footer>
    </main>
  );
}
