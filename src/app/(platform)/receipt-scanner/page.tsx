import { PageHero } from "@/components/shared/page-hero";
import { ReceiptScannerPanel } from "@/features/receipts/components/receipt-scanner-panel";

export default function ReceiptScannerPage() {
  return (
    <>
      <PageHero
        eyebrow="Receipt Intelligence"
        title="Turn everyday spending into carbon-aware purchase data."
        description="Scan receipts, classify vendors, and understand the emissions profile behind your monthly spending patterns."
      />
      <ReceiptScannerPanel />
    </>
  );
}
