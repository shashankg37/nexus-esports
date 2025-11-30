import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { GamingCard } from "@/components/GamingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Settings, Code2, Plus } from "lucide-react";
import { toast } from "sonner";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");

  const handleLogout = () => {
    navigate("/admin/login");
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tournament created successfully!");
  };

  const handleGenerateFixtures = () => {
    toast.success("Fixtures generated!");
  };

  const tournaments = [
    { id: 1, name: "Winter Championship 2024", teams: 16, status: "Active" },
    { id: 2, name: "Spring Qualifiers", teams: 8, status: "Scheduled" },
    { id: 3, name: "Summer Grand Finals", teams: 32, status: "Planning" },
  ];

  const matches = [
    { id: 1, tournament: "Winter Championship", team1: "Team A", team2: "Team B", time: "2:00 PM", roomCode: "ABC123" },
    { id: 2, tournament: "Winter Championship", team1: "Team C", team2: "Team D", time: "4:00 PM", roomCode: "DEF456" },
    { id: 3, tournament: "Spring Qualifiers", team1: "Team E", team2: "Team F", time: "6:00 PM", roomCode: "GHI789" },
  ];

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
                    className="bg-secondary border-border focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teams">Number of Teams</Label>
                    <Input
                      id="teams"
                      type="number"
                      placeholder="16"
                      className="bg-secondary border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Start Date</Label>
                    <Input
                      id="date"
                      type="date"
                      className="bg-secondary border-border focus:border-primary"
                    />
                  </div>
                </div>

                <Button type="submit" variant="gaming" className="w-full">
                  Create Tournament
                </Button>
              </form>

              <div className="mt-8">
                <h3 className="font-display font-semibold mb-4 text-foreground">Active Tournaments</h3>
                <div className="space-y-3">
                  {tournaments.map((tournament) => (
                    <div
                      key={tournament.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{tournament.name}</p>
                        <p className="text-sm text-muted-foreground">{tournament.teams} Teams</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-display font-semibold ${
                        tournament.status === "Active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  ))}
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
                  <select className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth">
                    <option>Winter Championship 2024</option>
                    <option>Spring Qualifiers</option>
                    <option>Summer Grand Finals</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <select className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground focus:border-primary transition-smooth">
                    <option>Single Elimination</option>
                    <option>Double Elimination</option>
                    <option>Round Robin</option>
                    <option>Swiss System</option>
                  </select>
                </div>

                <Button onClick={handleGenerateFixtures} variant="gaming" className="w-full">
                  Generate Fixtures
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
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary font-display">{match.tournament}</span>
                      <span className="text-xs text-muted-foreground">{match.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-semibold">{match.team1}</span>
                      <span className="text-primary font-display">VS</span>
                      <span className="text-foreground font-semibold">{match.team2}</span>
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
                ))}
              </div>
            </GamingCard>
          </TabsContent>

          <TabsContent value="rooms">
            <GamingCard>
              <h2 className="text-2xl font-display font-bold mb-6 text-foreground">Match Room Codes</h2>
              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{match.tournament}</p>
                        <p className="font-semibold text-foreground">
                          {match.team1} vs {match.team2}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Room Code</p>
                          <p className="text-xl font-display font-bold text-primary">{match.roomCode}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="gaming" className="w-full mt-4">
                  Generate New Room Code
                </Button>
              </div>
            </GamingCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
