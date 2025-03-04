
import { Link } from "react-router-dom";
import { MenuIcon, User, Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, Profile } from "@/lib/types";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categories: Category[];
  session: any | null;
  profile: Profile | null;
  handleLogout: () => Promise<void>;
}

const MobileNav = ({ 
  isOpen, 
  setIsOpen, 
  categories, 
  session, 
  profile, 
  handleLogout 
}: MobileNavProps) => {
  return (
    <>
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {categories.map((category) => (
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
    </>
  );
};

export default MobileNav;
