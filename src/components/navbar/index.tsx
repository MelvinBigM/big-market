
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NavLogo from "./NavLogo";

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
          <NavLogo />

          {/* Desktop Menu */}
          <DesktopNav 
            categories={categories || []} 
            session={session}
            profile={profile}
            handleLogout={handleLogout}
          />

          {/* Mobile menu button */}
          <MobileNav 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            categories={categories || []}
            session={session}
            profile={profile}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
