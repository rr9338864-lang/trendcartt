import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Props {
  title: string;
  eyebrow?: string;
  action?: { label: string; to: string } | undefined;
  children?: ReactNode;
}

export function SectionHeading({ title, eyebrow, action, children }: Props) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
      {action && (
        <Link
          to={action.to}
          className="shrink-0 text-xs font-semibold text-ink-muted transition-colors hover:text-foreground"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
