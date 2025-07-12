
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, Settings, X, User, LogOut, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { NotificationBadge } from "./ui/notification-badge";
import { useAccessRequests } from "@/hooks/useAccessRequests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session, profile } = useAuth();
  const navigate = useNavigate();

  const { pendingCount } = useAccessRequests();
  const showNotification = profile?.role === 'admin' && pendingCount > 0;

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
    staleTime: 0,
  });

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

  // Get user display name
  const getUserDisplayName = () => {
    if (!profile) return "Utilisateur";
    
    if (profile.is_company && profile.company_name) {
      return profile.company_name;
    }
    
    if (profile.manager_first_name && profile.manager_last_name) {
      return `${profile.manager_first_name} ${profile.manager_last_name}`;
    }
    
    if (profile.manager_first_name) {
      return profile.manager_first_name;
    }
    
    return session?.user?.email?.split('@')[0] || "Utilisateur";
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <UserCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white border border-gray-200 shadow-lg z-[60]"
                  sideOffset={5}
                >
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center relative cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Administration
                        {showNotification && (
                          <NotificationBadge 
                            count={pendingCount}
                            className="ml-auto scale-75" 
                          />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center cursor-pointer hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline">Se connecter</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default">S'inscrire</Button>
                </Link>
              </div>
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
        <div className="md:hidden animate-fadeIn bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
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
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md">
                    <UserCircle className="h-5 w-5" />
                    <span>{getUserDisplayName()}</span>
                  </div>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Mon Profil
                    </Button>
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="relative">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-5 w-5 mr-2" />
                        Administration
                        {showNotification && (
                          <NotificationBadge 
                            count={pendingCount} 
                            className="relative top-0 right-0 ml-2 scale-75"
                          />
                        )}
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="default" 
                    className="justify-start"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
