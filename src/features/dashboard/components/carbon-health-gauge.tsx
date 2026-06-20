"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/carbon-engine";

interface CarbonHealthGaugeProps {
  score: number;
  size?: number;
}

export function CarbonHealthGauge({ score, size = 200 }: CarbonHealthGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Carbon Health Score: ${score} out of 100, rated ${label}`}
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-background-strong"
            transform="rotate(-90 100 100)"
          />
          {/* Animated score arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            transform="rotate(-90 100 100)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {score}
          </motion.span>
          <span
            className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
