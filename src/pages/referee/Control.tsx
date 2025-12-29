import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { authApi, refereeApi, playersApi } from "@/lib/api";

const RefereeControl = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("validate");
  const [matchCode, setMatchCode] = useState("");
  const [validatedMatch, setValidatedMatch] = useState<any>(null);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [completedMatches, setCompletedMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [scoreTeam1, setScoreTeam1] = useState("");
  const [scoreTeam2, setScoreTeam2] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [team1PlayerScores, setTeam1PlayerScores] = useState<Record<number, string>>({});
  const [team2PlayerScores, setTeam2PlayerScores] = useState<Record<number, string>>({});
  const [selectedTeam1Players, setSelectedTeam1Players] = useState<number[]>([]);
  const [selectedTeam2Players, setSelectedTeam2Players] = useState<number[]>([]);

  useEffect(() => {
    loadPendingMatches();
    loadCompletedMatches();
    loadPlayers();
  }, []);

  useEffect(() => {
    if (selectedMatchId) {
      // Reset player scores when match changes
      setTeam1PlayerScores({});
      setTeam2PlayerScores({});
      setSelectedTeam1Players([]);
      setSelectedTeam2Players([]);
    }
  }, [selectedMatchId]);

  const loadPendingMatches = async () => {
    try {
      const data = await refereeApi.getPendingMatches();
      setPendingMatches(data);
    } catch (error) {
      toast.error("Failed to load pending matches");
    }
  };

  const loadCompletedMatches = async () => {
    try {
      const data = await refereeApi.getCompletedMatches();
      setCompletedMatches(data);
    } catch (error) {
      toast.error("Failed to load completed matches");
    }
  };

  const loadPlayers = async () => {
    try {
      const data = await playersApi.getAll();
      setPlayers(data);
    } catch (error) {
      toast.error("Failed to load players");
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate("/referee/login");
  };

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchCode) {
      toast.error("Please enter a match code");
      return;
    }

    try {
      const match = await refereeApi.validateCode(matchCode);
      setValidatedMatch(match);
      toast.success("Match code validated successfully!");
      setMatchCode("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid match code");
      setValidatedMatch(null);
    }
  };

  const handleAddPlayerToTeam = (playerId: number, team: "team1" | "team2") => {
    if (team === "team1") {
      if (!selectedTeam1Players.includes(playerId)) {
        setSelectedTeam1Players([...selectedTeam1Players, playerId]);
        setTeam1PlayerScores({ ...team1PlayerScores, [playerId]: "" });
      }
    } else {
      if (!selectedTeam2Players.includes(playerId)) {
        setSelectedTeam2Players([...selectedTeam2Players, playerId]);
        setTeam2PlayerScores({ ...team2PlayerScores, [playerId]: "" });
      }
    }
  };

  const handleRemovePlayerFromTeam = (playerId: number, team: "team1" | "team2") => {
    if (team === "team1") {
      setSelectedTeam1Players(selectedTeam1Players.filter(id => id !== playerId));
      const newScores = { ...team1PlayerScores };
      delete newScores[playerId];
      setTeam1PlayerScores(newScores);
    } else {
      setSelectedTeam2Players(selectedTeam2Players.filter(id => id !== playerId));
      const newScores = { ...team2PlayerScores };
      delete newScores[playerId];
      setTeam2PlayerScores(newScores);
    }
  };

  const calculateTeamSum = (scores: Record<number, string>) => {
    return Object.values(scores).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !scoreTeam1 || !scoreTeam2) {
      toast.error("Please fill in match scores");
      return;
    }

    if (selectedTeam1Players.length === 0 || selectedTeam2Players.length === 0) {
      toast.error("Please add at least one player to each team");
      return;
    }

    // Validate all player scores are filled
    const team1ScoresComplete = selectedTeam1Players.every(id => team1PlayerScores[id] && team1PlayerScores[id] !== "");
    const team2ScoresComplete = selectedTeam2Players.every(id => team2PlayerScores[id] && team2PlayerScores[id] !== "");

    if (!team1ScoresComplete || !team2ScoresComplete) {
      toast.error("Please fill in all player scores");
      return;
    }

    // Validate sums
    const team1Sum = calculateTeamSum(team1PlayerScores);
    const team2Sum = calculateTeamSum(team2PlayerScores);

    if (team1Sum !== parseInt(scoreTeam1)) {
      toast.error(`Team 1 player scores (${team1Sum}) must equal match score (${scoreTeam1})`);
      return;
    }

    if (team2Sum !== parseInt(scoreTeam2)) {
      toast.error(`Team 2 player scores (${team2Sum}) must equal match score (${scoreTeam2})`);
      return;
    }

    try {
      const team1PlayersData = selectedTeam1Players.map(id => ({
        player_id: id,
        score: parseInt(team1PlayerScores[id]),
      }));

      const team2PlayersData = selectedTeam2Players.map(id => ({
        player_id: id,
        score: parseInt(team2PlayerScores[id]),
      }));

      await refereeApi.submitResult(
        parseInt(selectedMatchId),
        parseInt(scoreTeam1),
        parseInt(scoreTeam2),
        team1PlayersData,
        team2PlayersData
      );
      toast.success("Match result submitted!");
      setSelectedMatchId("");
      setScoreTeam1("");
      setScoreTeam2("");
      setTeam1PlayerScores({});
      setTeam2PlayerScores({});
      setSelectedTeam1Players([]);
      setSelectedTeam2Players([]);
      loadPendingMatches();
      loadCompletedMatches();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit result");
    }
  };

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
                <p className="text-3xl font-display font-bold text-primary">{completedMatches.length}</p>
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

                {validatedMatch && (
                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm font-semibold text-foreground mb-2">Validated Match:</p>
                    <p className="text-sm text-foreground">
                      {validatedMatch.team1_name} vs {validatedMatch.team2_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Status: {validatedMatch.status}</p>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm text-foreground">
                    💡 <strong>Info:</strong> Match codes are 6-character alphanumeric codes provided by tournament admins
                  </p>
                </div>
              </GamingCard>

              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Pending Validations</h2>
                <div className="space-y-3">
                  {pendingMatches.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No pending matches</p>
                  ) : (
                    pendingMatches.map((match) => (
                      <div
                        key={match.id}
                        className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-primary font-display">Match #{match.id}</span>
                          <span className="px-2 py-1 rounded-full text-xs font-display font-semibold bg-muted text-muted-foreground">
                            {match.room_code}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{match.team1_name}</span>
                          <span className="text-primary font-display text-xs">VS</span>
                          <span className="text-sm text-foreground">{match.team2_name}</span>
                        </div>
                      </div>
                    ))
                  )}
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
                      value={selectedMatchId}
                      onChange={(e) => setSelectedMatchId(e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth"
                    >
                      <option value="">Select a match</option>
                      {pendingMatches.map((match) => (
                        <option key={match.id} value={match.id}>
                          {match.team1_name} vs {match.team2_name} - {match.room_code || "No code"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedMatchId && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="team1-score">
                            {pendingMatches.find(m => m.id === parseInt(selectedMatchId))?.team1_name || "Team 1"} Score
                          </Label>
                          <Input
                            id="team1-score"
                            type="number"
                            placeholder="0"
                            value={scoreTeam1}
                            onChange={(e) => setScoreTeam1(e.target.value)}
                            className="bg-secondary border-border focus:border-primary text-center text-xl font-display"
                            min="0"
                          />
                          <p className="text-xs text-muted-foreground">
                            Player sum: {calculateTeamSum(team1PlayerScores)} / {scoreTeam1 || 0}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="team2-score">
                            {pendingMatches.find(m => m.id === parseInt(selectedMatchId))?.team2_name || "Team 2"} Score
                          </Label>
                          <Input
                            id="team2-score"
                            type="number"
                            placeholder="0"
                            value={scoreTeam2}
                            onChange={(e) => setScoreTeam2(e.target.value)}
                            className="bg-secondary border-border focus:border-primary text-center text-xl font-display"
                            min="0"
                          />
                          <p className="text-xs text-muted-foreground">
                            Player sum: {calculateTeamSum(team2PlayerScores)} / {scoreTeam2 || 0}
                          </p>
                        </div>
                      </div>

                      {/* Team 1 Players */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">
                            {pendingMatches.find(m => m.id === parseInt(selectedMatchId))?.team1_name || "Team 1"} Players
                          </Label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddPlayerToTeam(parseInt(e.target.value), "team1");
                                e.target.value = "";
                              }
                            }}
                            className="h-8 px-2 rounded-md bg-secondary border border-border text-sm"
                          >
                            <option value="">Add Player</option>
                            {players
                              .filter(p => !selectedTeam1Players.includes(p.id))
                              .map(p => (
                                <option key={p.id} value={p.id}>{p.player_name}</option>
                              ))}
                          </select>
                        </div>
                        {selectedTeam1Players.map(playerId => {
                          const player = players.find(p => p.id === playerId);
                          return (
                            <div key={playerId} className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Score"
                                value={team1PlayerScores[playerId] || ""}
                                onChange={(e) => setTeam1PlayerScores({
                                  ...team1PlayerScores,
                                  [playerId]: e.target.value
                                })}
                                className="flex-1"
                                min="0"
                              />
                              <span className="text-sm text-foreground min-w-[120px]">{player?.player_name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePlayerFromTeam(playerId, "team1")}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Team 2 Players */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">
                            {pendingMatches.find(m => m.id === parseInt(selectedMatchId))?.team2_name || "Team 2"} Players
                          </Label>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddPlayerToTeam(parseInt(e.target.value), "team2");
                                e.target.value = "";
                              }
                            }}
                            className="h-8 px-2 rounded-md bg-secondary border border-border text-sm"
                          >
                            <option value="">Add Player</option>
                            {players
                              .filter(p => !selectedTeam2Players.includes(p.id))
                              .map(p => (
                                <option key={p.id} value={p.id}>{p.player_name}</option>
                              ))}
                          </select>
                        </div>
                        {selectedTeam2Players.map(playerId => {
                          const player = players.find(p => p.id === playerId);
                          return (
                            <div key={playerId} className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Score"
                                value={team2PlayerScores[playerId] || ""}
                                onChange={(e) => setTeam2PlayerScores({
                                  ...team2PlayerScores,
                                  [playerId]: e.target.value
                                })}
                                className="flex-1"
                                min="0"
                              />
                              <span className="text-sm text-foreground min-w-[120px]">{player?.player_name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePlayerFromTeam(playerId, "team2")}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    variant="gaming" 
                    className="w-full"
                    disabled={!selectedMatchId || !scoreTeam1 || !scoreTeam2}
                  >
                    Submit Result
                  </Button>
                </form>
              </GamingCard>

              <GamingCard>
                <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Recent Submissions</h2>
                <div className="space-y-3">
                  {completedMatches.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No completed matches</p>
                  ) : (
                    completedMatches.map((match) => {
                      const winner = match.score_team1 > match.score_team2 ? match.team1_name : match.team2_name;
                      return (
                        <div
                          key={match.id}
                          className="p-4 rounded-lg bg-secondary/50 border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {match.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString() : "N/A"}
                            </span>
                            <span className="text-xs font-display font-semibold text-primary">
                              {match.score_team1} - {match.score_team2}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={winner === match.team1_name ? "text-primary font-semibold" : "text-muted-foreground"}>
                              {match.team1_name}
                            </span>
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className={winner === match.team2_name ? "text-primary font-semibold" : "text-muted-foreground"}>
                              {match.team2_name}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
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
