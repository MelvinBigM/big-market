
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, User, Settings, LogOut, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, profile } = useAuth();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");

      if (error) throw error;
      return data as Category[];
    },
    staleTime: 0, // Force le rafraîchissement des données
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <TooltipProvider>
                <div className="flex items-center space-x-3">
                  {/* Admin or Profile button with icon */}
                  {profile?.role === 'admin' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/admin">
                          <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Administration</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                  
                  {/* Profile button for everyone */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/profile">
                        <Button variant="ghost" size="icon">
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mon profil</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Logout button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Se déconnecter</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            ) : (
              <Link to="/login">
                <Button variant="default">Se connecter</Button>
              </Link>
            )}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col space-y-2 px-3">
              {session ? (
                <>
                  {profile?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-5 w-5 mr-2" />
                        Administration
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Mon profil
                    </Button>
                  </Link>
                  <Button 
                    variant="default" 
                    className="justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" />
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
