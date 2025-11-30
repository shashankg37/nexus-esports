import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const RefereeControl = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("validate");
  const [matchCode, setMatchCode] = useState("");

  const handleLogout = () => {
    navigate("/referee/login");
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchCode) {
      toast.success("Match code validated successfully!");
      setMatchCode("");
    } else {
      toast.error("Please enter a match code");
    }
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Match result submitted!");
  };

  const pendingMatches = [
    { id: 1, code: "ABC123", team1: "Team Alpha", team2: "Team Beta", tournament: "Winter Championship" },
    { id: 2, code: "DEF456", team1: "Team Gamma", team2: "Team Delta", tournament: "Spring Qualifiers" },
    { id: 3, code: "GHI789", team1: "Team Epsilon", team2: "Team Zeta", tournament: "Winter Championship" },
  ];

  const completedMatches = [
    { id: 1, team1: "Team A", team2: "Team B", score: "16-14", winner: "Team A", date: "Dec 1" },
    { id: 2, team1: "Team C", team2: "Team D", score: "13-16", winner: "Team D", date: "Nov 30" },
    { id: 3, team1: "Team E", team2: "Team F", score: "16-12", winner: "Team E", date: "Nov 29" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar portalName="Referee Portal" onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2 text-glow">
            REFEREE CONTROL ROOM
          </h1>
          <p className="text-muted-foreground">Validate matches and submit official results</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Matches</p>
                <p className="text-3xl font-display font-bold text-foreground">{pendingMatches.length}</p>
              </div>
              <Flag className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
                <p className="text-3xl font-display font-bold text-primary">12</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Disputed</p>
                <p className="text-3xl font-display font-bold text-foreground">0</p>
              </div>
              <XCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          </GamingCard>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="validate" className="font-display">
              <Flag className="mr-2 h-4 w-4" />
              Validate Match Code
            </TabsTrigger>
            <TabsTrigger value="submit" className="font-display">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Validate Match Code</h2>
                <form onSubmit={handleValidateCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="match-code">Enter Match Code</Label>
                    <Input
                      id="match-code"
                      placeholder="ABC123"
                      value={matchCode}
                      onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
                      className="bg-secondary border-border focus:border-primary text-center text-2xl font-display tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button type="submit" variant="gaming" className="w-full">
                    Validate Code
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-foreground">
                    💡 <strong>Info:</strong> Match codes are 6-character alphanumeric codes provided by tournament admins
                  </p>
                </div>
              </GamingCard>

              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Pending Validations</h2>
                <div className="space-y-3">
                  {pendingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-primary font-display">{match.tournament}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-display font-semibold bg-muted text-muted-foreground">
                          {match.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{match.team1}</span>
                        <span className="text-primary font-display text-xs">VS</span>
                        <span className="text-sm text-foreground">{match.team2}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GamingCard>
            </div>
          </TabsContent>

          <TabsContent value="submit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Submit Match Result</h2>
                <form onSubmit={handleSubmitResult} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="match-select">Select Match</Label>
                    <select
                      id="match-select"
                      className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                    >
                      {pendingMatches.map((match) => (
                        <option key={match.id} value={match.id}>
                          {match.team1} vs {match.team2} - {match.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team1-score">Team 1 Score</Label>
                      <Input
                        id="team1-score"
                        type="number"
                        placeholder="0"
                        className="bg-secondary border-border focus:border-primary text-center text-xl font-display"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team2-score">Team 2 Score</Label>
                      <Input
                        id="team2-score"
                        type="number"
                        placeholder="0"
                        className="bg-secondary border-border focus:border-primary text-center text-xl font-display"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="winner">Winner</Label>
                    <select
                      id="winner"
                      className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                    >
                      <option>Team Alpha</option>
                      <option>Team Beta</option>
                    </select>
                  </div>

                  <Button type="submit" variant="gaming" className="w-full">
                    Submit Result
                  </Button>
                </form>
              </GamingCard>

              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Recent Submissions</h2>
                <div className="space-y-3">
                  {completedMatches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{match.date}</span>
                        <span className="text-xs font-display font-semibold text-primary">
                          {match.score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={match.winner === match.team1 ? "text-primary font-semibold" : "text-muted-foreground"}>
                          {match.team1}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className={match.winner === match.team2 ? "text-primary font-semibold" : "text-muted-foreground"}>
                          {match.team2}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GamingCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RefereeControl;
