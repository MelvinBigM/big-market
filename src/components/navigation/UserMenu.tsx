
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, LogOut, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotificationBadge } from "../ui/notification-badge";
import { useAccessRequests } from "@/hooks/useAccessRequests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";

export const UserMenu = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const { pendingCount } = useAccessRequests();
  const showNotification = profile?.role === 'admin' && pendingCount > 0;

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

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/login">
          <Button variant="outline">Se connecter</Button>
        </Link>
        <Link to="/register">
          <Button variant="default">S'inscrire</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors relative"
        >
          <UserCircle className="h-5 w-5 text-gray-600" />
          <span className="text-gray-800 font-medium">{getUserDisplayName()}</span>
          {showNotification && (
            <NotificationBadge 
              count={pendingCount}
              className="absolute -top-1 -right-1 scale-75" 
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-[60]"
        sideOffset={5}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
  );
};
