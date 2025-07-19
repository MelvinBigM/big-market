
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Settings, User, LogOut, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";
import { NotificationBadge } from "../ui/notification-badge";
import { useAccessRequests } from "@/hooks/useAccessRequests";
import { ThemeToggle } from "../ThemeToggle";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const MobileNav = ({ isOpen, setIsOpen, handleLogout, isLoggingOut }: MobileNavProps) => {
  const { session, profile } = useAuth();
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

  if (!isOpen) return null;

  return (
    <div className="md:hidden animate-fadeIn bg-background border-t">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {categories?.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
            {category.name}
          </Link>
        ))}
        <div className="mt-4 flex flex-col space-y-2 px-3">
          <div className="flex justify-center mb-2">
            <ThemeToggle />
          </div>
          {session ? (
            <>
              <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-muted rounded-md">
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
  );
};
