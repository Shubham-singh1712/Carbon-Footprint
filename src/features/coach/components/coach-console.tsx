"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Leaf,
  SendHorizonal,
  Sparkles,
  ArrowDownRight,
  Clock,
  IndianRupee,
} from "lucide-react";
import { useUserProfile } from "@/stores/user-profile";
import { typedFetch } from "@/lib/api/client";
import {
  coachPromptSchema,
  coachResponseSchema,
  type CoachResponse,
} from "@/features/coach/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { staggerContainer, staggerItem } from "@/lib/motion";

type ConversationMessage =
  | { role: "assistant"; content: string; meta?: CoachResponse }
  | { role: "user"; content: string };

const starterPrompts = [
  "How can I lower my commute footprint without losing flexibility?",
  "What should I change in my weekly grocery basket?",
  "Give me a carbon-light routine for business travel weeks.",
  "How can I reduce energy use at home?",
];

const difficultyColor = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Challenging: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function CoachConsole() {
  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profile = useUserProfile((state) => state.profile);
  const onboardingComplete = useUserProfile((state) => state.onboardingComplete);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: "assistant",
      content:
        "I'm watching your mobility, food, and home patterns. Ask me for a reduction plan and I'll turn your footprint into a realistic weekly playbook.",
    },
  ]);

  const coachMutation = useMutation({
    mutationFn: async (value: string) => {
      const parsed = coachPromptSchema.parse({
        prompt: value,
        profile: onboardingComplete ? profile : undefined,
      });
      return typedFetch(
        "/api/platform/coach",
        { method: "POST", body: JSON.stringify(parsed) },
        coachResponseSchema,
      );
    },
    onSuccess: (response, submittedPrompt) => {
      setMessages((current) => [
        ...current,
        { role: "user", content: submittedPrompt },
        { role: "assistant", content: response.message, meta: response },
      ]);
      setPrompt("");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (prompt.trim().length >= 8) {
      coachMutation.mutate(prompt);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              Conversational Intelligence
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">
              Ask CarbonTwin to coach your next move
            </h3>
          </div>
          <Badge variant="neutral">AI ready</Badge>
        </div>

        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-[28px] p-5 ${
                  message.role === "assistant"
                    ? "border border-white/70 bg-white/78 dark:border-white/10 dark:bg-white/5"
                    : "bg-accent text-white"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <Leaf className="h-4 w-4" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    {message.role === "assistant" ? "Carbon Coach" : "You"}
                  </span>
                </div>
                <p className="text-sm leading-7">{message.content}</p>

                {/* Structured recommendations */}
                {message.role === "assistant" && message.meta?.recommendations?.length ? (
                  <motion.div
                    className="mt-5 space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {message.meta.recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        variants={staggerItem}
                        className="rounded-[22px] border border-white/60 bg-white/60 p-4 text-foreground dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{rec.suggestedAction}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${difficultyColor[rec.difficulty]}`}>
                            {rec.difficulty}
                          </span>
                        </div>
                        <p className="mb-3 text-xs text-muted">
                          Currently: {rec.currentBehavior}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-accent-soft p-2 text-center">
                            <ArrowDownRight className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                            <p className="mt-1 text-xs font-bold text-accent">{rec.co2ReductionKg} kg</p>
                            <p className="text-[10px] text-muted">CO₂/month</p>
                          </div>
                          <div className="rounded-xl bg-accent-soft p-2 text-center">
                            <IndianRupee className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                            <p className="mt-1 text-xs font-bold text-accent">{rec.costSavings}</p>
                            <p className="text-[10px] text-muted">Savings</p>
                          </div>
                          <div className="rounded-xl bg-accent-soft p-2 text-center">
                            <Clock className="mx-auto h-3.5 w-3.5 text-accent" aria-hidden="true" />
                            <p className="mt-1 text-xs font-bold text-accent">{rec.timeRequired}</p>
                            <p className="text-[10px] text-muted">Time</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}

                {/* Insights & next actions */}
                {message.role === "assistant" && message.meta && !message.meta.recommendations?.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[22px] bg-white/70 p-4 text-foreground dark:bg-white/5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        Insights
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                        {message.meta.insights.map((insight) => (
                          <li key={insight}>• {insight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[22px] bg-white/70 p-4 text-foreground dark:bg-white/5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        Next Actions
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                        {message.meta.nextActions.map((action) => (
                          <li key={action}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {coachMutation.isPending ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-[28px] border border-white/70 bg-white/78 px-5 py-4 dark:border-white/10 dark:bg-white/5"
            >
              <Bot className="h-4 w-4 text-muted" />
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted">Analyzing your patterns...</span>
            </motion.div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 rounded-[28px] border border-white/70 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask about travel, food, shopping, home energy, or habit design."
            aria-label="Ask the AI Carbon Coach"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Press Enter to send, Shift+Enter for new line.
            </p>
            <Button
              onClick={handleSubmit}
              disabled={coachMutation.isPending || prompt.trim().length < 8}
            >
              <SendHorizonal className="mr-2 h-4 w-4" />
              {coachMutation.isPending ? "Thinking..." : "Send prompt"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Suggested Prompts
        </p>
        <div className="mt-4 space-y-3">
          {starterPrompts.map((item) => (
            <button
              key={item}
              className="w-full rounded-[24px] border border-white/70 bg-white/72 px-4 py-4 text-left text-sm leading-7 text-foreground transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
              onClick={() => setPrompt(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-[28px] bg-gradient-to-br from-accent to-accent-strong p-5 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">
              Weekly optimization
            </p>
          </div>
          <h3 className="mt-3 text-2xl font-semibold">
            CarbonTwin sees a 12% weekly reduction path.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/85">
            The highest-confidence move is shifting two car-heavy commute blocks
            to rail and consolidating one delivery order.
          </p>
        </div>
      </Card>
    </div>
  );
}
