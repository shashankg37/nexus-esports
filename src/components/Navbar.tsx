import { Button } from "@/components/ui/button";
import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  portalName?: string;
  onLogout?: () => void;
}

export const Navbar = ({ portalName, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-smooth">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">
                ESPORTS ARENA
              </h1>
              {portalName && (
                <p className="text-xs text-primary font-display">{portalName}</p>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {onLogout && (
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {onLogout && (
              <Button variant="outline" className="w-full" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
