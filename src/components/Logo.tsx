import { Link } from "@tanstack/react-router";

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <Link to="/" className={`font-display tracking-tight text-foreground ${className}`}>
      Trend<span className="text-brand">Cart</span>
    </Link>
  );
}
