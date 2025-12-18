import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, BarChart3, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { authApi, matchesApi, leaderboardApi, tournamentsApi } from "@/lib/api";

const PlayerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");
  const [matches, setMatches] = useState<any[]>([]);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);

  useEffect(() => {
    loadMyMatches();
    loadLeaderboard();
    loadTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      loadFixtures(selectedTournamentId);
    }
  }, [selectedTournamentId]);

  const loadMyMatches = async () => {
    try {
      const data = await matchesApi.getMyMatches();
      setMatches(data);
    } catch (error) {
      toast.error("Failed to load matches");
    }
  };

  const loadFixtures = async (tournamentId: number) => {
    try {
      const data = await matchesApi.getFixtures(tournamentId);
      setFixtures(data);
    } catch (error) {
      toast.error("Failed to load fixtures");
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardApi.get();
      setLeaderboard(data);
    } catch (error) {
      toast.error("Failed to load leaderboard");
    }
  };

  const loadTournaments = async () => {
    try {
      const data = await tournamentsApi.getAll();
      setTournaments(data);
      if (data.length > 0) {
        setSelectedTournamentId(data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load tournaments");
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate("/player/login");
  };

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
                <p className="text-3xl font-display font-bold text-foreground">{matches.length}</p>
              </div>
              <Trophy className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
                <p className="text-3xl font-display font-bold text-primary">
                  {matches.filter(m => m.status === "Scheduled" || m.status === "Live").length}
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
          </GamingCard>

          <GamingCard glow>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Rank</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  #{leaderboard.findIndex(p => p.player === "You") + 1 || "N/A"}
                </p>
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
                {matches.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No matches scheduled</p>
                ) : (
                  matches.map((match) => (
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
                          <p className="font-semibold text-foreground">
                            {match.team1_name} vs {match.team2_name}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            {match.scheduled_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(match.scheduled_at).toLocaleString()}
                              </span>
                            )}
                            {match.room_code && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {match.room_code}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="gaming" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="fixtures">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Tournament Bracket</h2>
              {tournaments.length > 0 && (
                <div className="mb-4">
                  <select
                    value={selectedTournamentId || ""}
                    onChange={(e) => setSelectedTournamentId(parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-4">
                {fixtures.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No fixtures available</p>
                ) : (
                  fixtures.map((fixture, index) => (
                    <div
                      key={fixture.id || index}
                      className="p-6 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-bold text-lg text-primary">Match #{fixture.id}</h3>
                        {fixture.scheduled_at && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(fixture.scheduled_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-semibold">{fixture.team1_name}</span>
                        <span className="text-primary font-display">VS</span>
                        <span className="text-foreground font-semibold">{fixture.team2_name}</span>
                      </div>
                      {fixture.status && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            fixture.status === "Completed" ? "bg-green-500/20 text-green-500" :
                            fixture.status === "Live" ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {fixture.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
