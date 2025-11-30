import { PortalCard } from "@/components/PortalCard";
import { Trophy, Shield, Flag } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <Trophy className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground text-glow">
            ESPORTS ARENA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional Tournament Management System
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PortalCard
            title="Player Portal"
            description="View matches, fixtures, and track your performance on the leaderboard"
            icon={Trophy}
            path="/player/login"
            gradient="bg-gradient-to-br from-card to-card"
          />
          
          <PortalCard
            title="Admin Portal"
            description="Create tournaments, generate fixtures, and manage all competitions"
            icon={Shield}
            path="/admin/login"
            gradient="bg-gradient-to-br from-card to-card"
          />
          
          <PortalCard
            title="Referee Portal"
            description="Validate match codes and submit official match results"
            icon={Flag}
            path="/referee/login"
            gradient="bg-gradient-to-br from-card to-card"
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built for the competitive gaming community
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
