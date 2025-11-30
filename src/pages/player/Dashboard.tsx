import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, BarChart3, Clock, MapPin, Users } from "lucide-react";

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");

  const handleLogout = () => {
    navigate("/player/login");
  };

  const matches = [
    { id: 1, opponent: "Team Alpha", time: "2:00 PM", date: "Today", status: "Live", map: "Dust II" },
    { id: 2, opponent: "Team Beta", time: "4:30 PM", date: "Tomorrow", status: "Scheduled", map: "Mirage" },
    { id: 3, opponent: "Team Gamma", time: "6:00 PM", date: "Dec 2", status: "Scheduled", map: "Inferno" },
  ];

  const fixtures = [
    { round: "Quarter Finals", team1: "You", team2: "Team Delta", date: "Dec 5" },
    { round: "Semi Finals", team1: "TBD", team2: "TBD", date: "Dec 8" },
    { round: "Finals", team1: "TBD", team2: "TBD", date: "Dec 10" },
  ];

  const leaderboard = [
    { rank: 1, player: "ProGamer_X", wins: 45, losses: 12, points: 1850 },
    { rank: 2, player: "You", wins: 38, losses: 15, points: 1720 },
    { rank: 3, player: "EliteSniper", wins: 35, losses: 18, points: 1650 },
    { rank: 4, player: "TacticalAce", wins: 32, losses: 20, points: 1580 },
    { rank: 5, player: "StealthKing", wins: 30, losses: 22, points: 1520 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar portalName="Player Portal" onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2 text-glow">
            WELCOME BACK, PLAYER
          </h1>
          <p className="text-muted-foreground">Track your progress and upcoming matches</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Matches</p>
                <p className="text-3xl font-display font-bold text-foreground">53</p>
              </div>
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                <p className="text-3xl font-display font-bold text-primary">72%</p>
              </div>
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                <p className="text-3xl font-display font-bold text-foreground">#2</p>
              </div>
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="matches" className="font-display">
              <Calendar className="mr-2 h-4 w-4" />
              My Matches
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="font-display">
              <Users className="mr-2 h-4 w-4" />
              Fixtures
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="font-display">
              <BarChart3 className="mr-2 h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Upcoming Matches</h2>
              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-display font-semibold ${
                        match.status === "Live" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {match.status}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">vs {match.opponent}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {match.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.map}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="gaming" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="fixtures">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Tournament Bracket</h2>
              <div className="space-y-4">
                {fixtures.map((fixture, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-lg text-primary">{fixture.round}</h3>
                      <span className="text-sm text-muted-foreground">{fixture.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-semibold">{fixture.team1}</span>
                      <span className="text-primary font-display">VS</span>
                      <span className="text-foreground font-semibold">{fixture.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="leaderboard">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Top Players</h2>
              <div className="space-y-2">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-lg transition-smooth ${
                      player.player === "You"
                        ? "bg-primary/10 border border-primary glow-crimson"
                        : "bg-secondary/50 border border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-display font-bold ${
                        player.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        player.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                        player.rank === 3 ? "bg-amber-700/20 text-amber-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{player.player}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.wins}W - {player.losses}L
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-display font-bold text-primary">{player.points}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                  </div>
                ))}
              </div>
            </GamingCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerDashboard;
