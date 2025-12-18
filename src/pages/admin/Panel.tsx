import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Settings, Code2, Plus } from "lucide-react";
import { toast } from "sonner";
import { authApi, tournamentsApi, matchesApi } from "@/lib/api";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [tournamentName, setTournamentName] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [fixtureFormat, setFixtureFormat] = useState("Single Elimination");

  useEffect(() => {
    loadTournaments();
    loadMatches();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await tournamentsApi.getAll();
      setTournaments(data);
    } catch (error) {
      toast.error("Failed to load tournaments");
    }
  };

  const loadMatches = async () => {
    try {
      const data = await matchesApi.getAll();
      setMatches(data);
    } catch (error) {
      toast.error("Failed to load matches");
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate("/admin/login");
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentName) {
      toast.error("Please enter a tournament name");
      return;
    }

    setLoading(true);
    try {
      await tournamentsApi.create({
        name: tournamentName,
        number_of_teams: numberOfTeams ? parseInt(numberOfTeams) : undefined,
        start_date: startDate || undefined,
      });
      toast.success("Tournament created successfully!");
      setTournamentName("");
      setNumberOfTeams("");
      setStartDate("");
      loadTournaments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create tournament");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFixtures = async () => {
    if (!selectedTournamentId) {
      toast.error("Please select a tournament");
      return;
    }

    setLoading(true);
    try {
      await matchesApi.generateFixtures(parseInt(selectedTournamentId), fixtureFormat);
      toast.success("Fixtures generated successfully!");
      loadMatches();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate fixtures");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoomCode = async (matchId: number) => {
    try {
      const updated = await matchesApi.generateRoomCode(matchId);
      toast.success("Room code generated!");
      loadMatches();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate room code");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar portalName="Admin Portal" onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2 text-glow">
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-muted-foreground">Manage tournaments and competitions</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="create" className="font-display">
              <Plus className="mr-2 h-4 w-4" />
              Create Tournament
            </TabsTrigger>
            <TabsTrigger value="fixtures" className="font-display">
              <Calendar className="mr-2 h-4 w-4" />
              Generate Fixtures
            </TabsTrigger>
            <TabsTrigger value="schedule" className="font-display">
              <Settings className="mr-2 h-4 w-4" />
              Schedule Matches
            </TabsTrigger>
            <TabsTrigger value="rooms" className="font-display">
              <Code2 className="mr-2 h-4 w-4" />
              Room Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Create New Tournament</h2>
              <form onSubmit={handleCreateTournament} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tournament-name">Tournament Name</Label>
                  <Input
                    id="tournament-name"
                    placeholder="Enter tournament name"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="bg-secondary border-border focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teams">Number of Teams</Label>
                    <Input
                      id="teams"
                      type="number"
                      placeholder="16"
                      value={numberOfTeams}
                      onChange={(e) => setNumberOfTeams(e.target.value)}
                      className="bg-secondary border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-secondary border-border focus:border-primary"
                    />
                  </div>
                </div>

                <Button type="submit" variant="gaming" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Tournament"}
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="font-display font-semibold mb-4 text-foreground">Active Tournaments</h3>
                <div className="space-y-3">
                  {tournaments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No tournaments yet</p>
                  ) : (
                    tournaments.map((tournament) => (
                      <div
                        key={tournament.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{tournament.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tournament.number_of_teams || "N/A"} Teams
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-display font-semibold ${
                          tournament.status === "Active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {tournament.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="fixtures">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Generate Tournament Fixtures</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Tournament</Label>
                  <select 
                    value={selectedTournamentId}
                    onChange={(e) => setSelectedTournamentId(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                  >
                    <option value="">Select a tournament</option>
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <select 
                    value={fixtureFormat}
                    onChange={(e) => setFixtureFormat(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                  >
                    <option>Single Elimination</option>
                    <option>Double Elimination</option>
                    <option>Round Robin</option>
                    <option>Swiss System</option>
                  </select>
                </div>

                <Button 
                  onClick={handleGenerateFixtures} 
                  variant="gaming" 
                  className="w-full"
                  disabled={loading || !selectedTournamentId}
                >
                  {loading ? "Generating..." : "Generate Fixtures"}
                </Button>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-foreground">
                    💡 <strong>Tip:</strong> Fixtures will be automatically generated based on the number of registered teams
                  </p>
                </div>
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="schedule">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Schedule Matches</h2>
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No matches scheduled yet</p>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-primary font-display">Match #{match.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : "Not scheduled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-semibold">{match.team1_name}</span>
                        <span className="text-primary font-display">VS</span>
                        <span className="text-foreground font-semibold">{match.team2_name}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Reschedule
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="rooms">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Match Room Codes</h2>
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No matches available</p>
                ) : (
                  matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">Match #{match.id}</p>
                          <p className="font-semibold text-foreground">
                            {match.team1_name} vs {match.team2_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Room Code</p>
                            <p className="text-xl font-display font-bold text-primary">
                              {match.room_code || "N/A"}
                            </p>
                          </div>
                          {match.room_code ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(match.room_code)}
                            >
                              Copy
                            </Button>
                          ) : (
                            <Button 
                              variant="gaming" 
                              size="sm"
                              onClick={() => handleGenerateRoomCode(match.id)}
                            >
                              Generate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GamingCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
