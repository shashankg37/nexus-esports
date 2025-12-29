import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GamingCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const GamingCard = ({ children, className, glow = false }: GamingCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 transition-smooth hover:border-primary/50",
        glow && "glow-crimson hover:glow-crimson-lg",
        className
      )}
    >
      {children}
    </div>
  );
};
