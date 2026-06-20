import { Badge } from "@/components/ui/badge";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="glass-panel-strong mb-6 px-6 py-8 sm:px-8">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
        {description}
      </p>
    </section>
  );
}
