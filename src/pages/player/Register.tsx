import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GamingCard } from "@/components/GamingCard";
import { Trophy, Mail, Lock, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";

const PlayerRegister = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            await authApi.register(email, password, "player");
            toast.success("Registration successful! Please log in.");
            navigate("/player/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse-glow" />

            <div className="relative z-10 w-full max-w-md px-4">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>

                <GamingCard glow className="backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center gap-2 mb-4">
                            <Trophy className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                            PLAYER REGISTRATION
                        </h1>
                        <p className="text-muted-foreground">Create your player account</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="player@esports.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-secondary border-border focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-secondary border-border focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-secondary border-border focus:border-primary"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="gaming"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {isLoading ? "Creating Account..." : "Join the Arena"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/player/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </GamingCard>
            </div>
        </div>
    );
};

export default PlayerRegister;
