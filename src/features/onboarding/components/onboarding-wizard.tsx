"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Home,
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  Leaf,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/stores/user-profile";
import {
  calculateMonthlyFootprint,
  calculateCarbonHealthScore,
  getScoreColor,
  getScoreLabel,
} from "@/lib/carbon-engine";
import type {
  TransportProfile,
  HomeProfile,
  FoodProfile,
  TravelProfile,
  ShoppingProfile,
} from "@/stores/user-profile";
import { slideInFromRight } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Step config                                                       */
/* ------------------------------------------------------------------ */

const steps = [
  { id: "transport", label: "Transportation", icon: Car },
  { id: "home", label: "Home Energy", icon: Home },
  { id: "food", label: "Food & Diet", icon: UtensilsCrossed },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
] as const;

/* ------------------------------------------------------------------ */
/*  Select helper component                                           */
/* ------------------------------------------------------------------ */

function SelectField({
  label,
  id,
  value,
  options,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-input-bg px-4 text-sm text-foreground outline-none focus:border-accent focus:ring-4 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slider helper component                                           */
/* ------------------------------------------------------------------ */

function SliderField({
  label,
  id,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="font-mono text-sm text-muted">
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wizard component                                                  */
/* ------------------------------------------------------------------ */

export function OnboardingWizard() {
  const router = useRouter();
  const profile = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  /* Local form state (simpler than react-hook-form for sliders) */
  const [transport, setTransport] = useState<TransportProfile>(profile.profile.transport);
  const [home, setHome] = useState<HomeProfile>(profile.profile.home);
  const [food, setFood] = useState<FoodProfile>(profile.profile.food);
  const [travel, setTravel] = useState<TravelProfile>(profile.profile.travel);
  const [shopping, setShopping] = useState<ShoppingProfile>(profile.profile.shopping);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      /* Final step → calculate results */
      const data = { transport, home, food, travel, shopping };
      const { total, breakdown } = calculateMonthlyFootprint(data);
      const score = calculateCarbonHealthScore(total);

      profile.updateTransport(transport);
      profile.updateHome(home);
      profile.updateFood(food);
      profile.updateTravel(travel);
      profile.updateShopping(shopping);
      profile.completeOnboarding(score, total, breakdown);

      setShowResult(true);
    }
  }, [currentStep, transport, home, food, travel, shopping, profile]);

  /* Result screen */
  if (showResult) {
    const score = profile.carbonHealthScore;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl"
      >
        <Card className="overflow-hidden p-0">
          <div
            className="p-8 text-center text-white"
            style={{
              background: `linear-gradient(135deg, ${getScoreColor(score)} 0%, ${getScoreColor(score)}dd 100%)`,
            }}
          >
            <Leaf className="mx-auto h-10 w-10" aria-hidden="true" />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/80">
              Your Carbon Health Score
            </p>
            <p className="mt-3 text-7xl font-bold">{score}</p>
            <p className="mt-2 text-lg font-semibold">{getScoreLabel(score)}</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Monthly</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {profile.monthlyFootprintKg.toFixed(0)} <span className="text-sm">kg CO₂e</span>
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Annual</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {(profile.monthlyFootprintKg * 12 / 1000).toFixed(1)} <span className="text-sm">t CO₂e</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(profile.breakdown).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted">{key}</span>
                  <span className="font-semibold text-foreground">{val.toFixed(1)} kg</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={() => {
                toast.success("Welcome to CarbonTwin AI!");
                router.push("/dashboard");
              }}
            >
              Go to dashboard
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  /* Step content */
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <SliderField
              label="Daily commute distance"
              id="commute-distance"
              value={transport.commuteDistanceKm}
              min={0}
              max={100}
              unit="km"
              onChange={(v) => setTransport({ ...transport, commuteDistanceKm: v })}
            />
            <SelectField
              label="Vehicle type"
              id="vehicle-type"
              value={transport.vehicleType}
              options={[
                { value: "car-petrol", label: "Car (Petrol)" },
                { value: "car-diesel", label: "Car (Diesel)" },
                { value: "car-electric", label: "Car (Electric)" },
                { value: "motorcycle", label: "Motorcycle" },
                { value: "none", label: "No vehicle" },
              ]}
              onChange={(v) => setTransport({ ...transport, vehicleType: v as TransportProfile["vehicleType"] })}
            />
            <SliderField
              label="Public transport days per week"
              id="public-transport"
              value={transport.publicTransportDays}
              min={0}
              max={7}
              unit="days"
              onChange={(v) => setTransport({ ...transport, publicTransportDays: v })}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <SliderField
              label="Monthly electricity consumption"
              id="electricity"
              value={home.electricityKwh}
              min={50}
              max={1000}
              step={10}
              unit="kWh"
              onChange={(v) => setHome({ ...home, electricityKwh: v })}
            />
            <SelectField
              label="Appliance usage intensity"
              id="appliance-usage"
              value={home.applianceUsage}
              options={[
                { value: "low", label: "Low — minimal devices" },
                { value: "moderate", label: "Moderate — average household" },
                { value: "high", label: "High — many always-on devices" },
              ]}
              onChange={(v) => setHome({ ...home, applianceUsage: v as HomeProfile["applianceUsage"] })}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <SelectField
              label="Diet preference"
              id="diet-type"
              value={food.dietType}
              options={[
                { value: "vegan", label: "Vegan" },
                { value: "vegetarian", label: "Vegetarian" },
                { value: "flexitarian", label: "Flexitarian" },
                { value: "omnivore", label: "Omnivore" },
              ]}
              onChange={(v) => setFood({ ...food, dietType: v as FoodProfile["dietType"] })}
            />
            <SliderField
              label="Meat-based meals per week"
              id="meat-meals"
              value={food.meatMealsPerWeek}
              min={0}
              max={21}
              unit="meals"
              onChange={(v) => setFood({ ...food, meatMealsPerWeek: v })}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <SliderField
              label="Flights per year"
              id="flights"
              value={travel.flightsPerYear}
              min={0}
              max={20}
              unit="flights"
              onChange={(v) => setTravel({ ...travel, flightsPerYear: v })}
            />
            <SliderField
              label="Train trips per year"
              id="trains"
              value={travel.trainTripsPerYear}
              min={0}
              max={50}
              unit="trips"
              onChange={(v) => setTravel({ ...travel, trainTripsPerYear: v })}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <SliderField
              label="Monthly shopping spend"
              id="shopping-spend"
              value={shopping.monthlySpend}
              min={0}
              max={50000}
              step={500}
              unit="₹"
              onChange={(v) => setShopping({ ...shopping, monthlySpend: v })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isDone
                      ? "bg-accent text-white"
                      : isActive
                        ? "bg-accent text-white ring-4 ring-ring"
                        : "bg-background-strong text-muted"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden text-xs font-medium text-muted sm:block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-2 rounded-full bg-background-strong">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Step card */}
      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <StepIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <Badge>Step {currentStep + 1} of {steps.length}</Badge>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">
              {steps[currentStep].label}
            </h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button onClick={goNext}>
            {currentStep === steps.length - 1 ? "Calculate score" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
