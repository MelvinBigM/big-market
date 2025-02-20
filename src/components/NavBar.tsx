
import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, User, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { name: "Sodas", path: "/categories/sodas" },
    { name: "Jus", path: "/categories/jus" },
    { name: "Eaux", path: "/categories/eaux" },
    { name: "Chips", path: "/categories/chips" },
    { name: "Alcool", path: "/categories/alcool" },
    { name: "Autres", path: "/categories/autres" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Big Market
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default">Se connecter</Button>
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
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Button variant="outline" className="justify-start">
                <User className="h-5 w-5 mr-2" />
                Se connecter
              </Button>
              <Button variant="outline" className="justify-start">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Panier
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
