"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera, ReceiptText, ScanLine } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { typedFetch } from "@/lib/api/client";
import {
  receiptAnalysisRequestSchema,
  receiptAnalysisResponseSchema,
  type ReceiptAnalysisRequest,
} from "@/features/receipts/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const categories: ReceiptAnalysisRequest["category"][] = [
  "food",
  "mobility",
  "home",
  "shopping",
  "digital",
];

export function ReceiptScannerPanel() {
  const [fileName, setFileName] = useState("No receipt selected");
  const [imageRaw, setImageRaw] = useState<string | null>(null);
  
  const form = useForm<ReceiptAnalysisRequest>({
    resolver: zodResolver(receiptAnalysisRequestSchema),
    defaultValues: {
      receiptLabel: "Weekend grocery receipt",
      vendor: "Fresh Market",
      amount: 84.6,
      category: "food",
      paymentMethod: "Card",
    },
  });

  const scanMutation = useMutation({
    mutationFn: (values: ReceiptAnalysisRequest) =>
      typedFetch(
        "/api/platform/receipt",
        { method: "POST", body: JSON.stringify(values) },
        receiptAnalysisResponseSchema,
      ),
    onSuccess: (data) => {
      form.setValue("vendor", data.normalized.vendor);
      form.setValue("amount", data.normalized.spend);
      form.setValue("category", data.normalized.category as "food" | "mobility" | "home" | "shopping" | "digital");
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr]">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-foreground">Receipt Scanner</h3>
            <p className="text-sm text-muted">
              Upload or model a receipt and translate spend into carbon impact.
            </p>
          </div>
        </div>

        <label className="mb-5 block rounded-[28px] border border-dashed border-accent/30 bg-white/75 dark:border-white/10 dark:bg-white/5 p-6 cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-all">
          <div className="flex flex-col items-center justify-center text-center">
            <Camera className="h-8 w-8 text-accent" />
            <p className="mt-3 text-base font-semibold text-foreground">
              Drop in a receipt image or PDF
            </p>
            <p className="mt-2 text-sm text-muted">{fileName}</p>
          </div>
          <input
            className="hidden"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  setImageRaw(base64);
                  
                  // Auto extract with AI OCR
                  scanMutation.mutate({
                    receiptLabel: file.name.split(".")[0],
                    vendor: "Extracting...",
                    amount: 1.0,
                    category: "shopping",
                    paymentMethod: "UPI/Card",
                    image: base64,
                  });
                };
                reader.readAsDataURL(file);
              } else {
                setFileName("No receipt selected");
                setImageRaw(null);
              }
            }}
          />
        </label>

        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) =>
            scanMutation.mutate({ ...values, image: imageRaw || undefined })
          )}
        >
          <Input placeholder="Receipt label" {...form.register("receiptLabel")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Vendor" {...form.register("vendor")} />
            <Input
              placeholder="Payment method"
              {...form.register("paymentMethod")}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              step="0.01"
              type="number"
              placeholder="Amount"
              {...form.register("amount", { valueAsNumber: true })}
            />
            <select
              className="h-11 rounded-2xl border border-white/70 bg-white/80 dark:border-white/10 dark:bg-white/5 px-4 text-sm text-foreground outline-none focus:border-accent focus:ring-4 focus:ring-ring"
              {...form.register("category")}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={scanMutation.isPending}>
            <ScanLine className="mr-2 h-4 w-4" />
            {scanMutation.isPending ? "Analyzing..." : "Analyze receipt"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Extraction Result
        </p>
        {scanMutation.data ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-[28px] bg-gradient-to-br from-accent to-accent-strong p-5 text-white">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/80">
                Estimated impact
              </p>
              <p className="mt-3 text-4xl font-semibold">
                {scanMutation.data.estimatedKg} kg CO2e
              </p>
              <p className="mt-2 text-sm text-white/80">
                Confidence {scanMutation.data.confidence}%
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/78 dark:border-white/10 dark:bg-white/5 p-4">
              <p className="font-semibold text-foreground">
                {scanMutation.data.normalized.vendor}
              </p>
              <p className="mt-1 text-sm text-muted">
                {scanMutation.data.normalized.category} • ${scanMutation.data.normalized.spend}
              </p>
              <p className="mt-1 text-sm text-muted">
                Impact band: {scanMutation.data.normalized.impactBand}
              </p>
            </div>
            <div className="space-y-3">
              {scanMutation.data.insights.map((insight) => (
                <div
                  key={insight}
                  className="rounded-[22px] border border-white/70 bg-white/72 dark:border-white/10 dark:bg-white/5 px-4 py-3 text-sm text-muted"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">
            CarbonTwin maps vendor, category, and spend into impact bands so every purchase can roll up into your footprint model.
          </p>
        )}
      </Card>
    </div>
  );
}
