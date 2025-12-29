import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
}

export const PortalCard = ({ title, description, icon: Icon, path, gradient }: PortalCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-smooth hover:border-primary/50 hover:glow-crimson cursor-pointer ${gradient}`}
      onClick={() => navigate(path)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      
      <div className="relative z-10">
        <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-4 group-hover:bg-primary/20 transition-smooth">
          <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-smooth" />
        </div>
        
        <h3 className="mb-2 text-2xl font-display font-bold text-foreground group-hover:text-primary transition-smooth">
          {title}
        </h3>
        
        <p className="mb-6 text-muted-foreground group-hover:text-foreground/80 transition-smooth">
          {description}
        </p>
        
        <Button variant="gaming" className="w-full">
          Enter Portal
        </Button>
      </div>
    </div>
  );
};
