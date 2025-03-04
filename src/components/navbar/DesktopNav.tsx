
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Category, Profile } from "@/lib/types";

interface DesktopNavProps {
  categories: Category[];
  session: any | null;
  profile: Profile | null;
  handleLogout: () => Promise<void>;
}

const DesktopNav = ({ categories, session, profile, handleLogout }: DesktopNavProps) => {
  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        {categories.map((category) => (
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
    </>
  );
};

export default DesktopNav;
