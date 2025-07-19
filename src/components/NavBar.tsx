
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserMenu } from "./navigation/UserMenu";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    console.log("Starting logout process...");
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Erreur lors de la déconnexion");
      } else {
        console.log("Logout successful");
        toast.success("Déconnexion réussie");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Logout catch error:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
                alt="Big Market Logo" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-primary hidden sm:block">
                Big Market
              </span>
            </Link>
          </div>

          <DesktopNav />

          <div className="hidden md:flex items-center space-x-4">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileNav 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </nav>
  );
};

export default NavBar;
