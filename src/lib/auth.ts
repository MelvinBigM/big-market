
import { createContext, useContext } from "react";
import { Profile } from "./types";

export type AuthContextType = {
  isLoading: boolean;
  session: any | null;
  profile: Profile | null;
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  session: null,
  profile: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = (context: AuthContextType) => {
  return !context.isLoading && !!context.session;
};

// Fonction utilitaire pour vérifier si l'utilisateur est admin
export const isAdmin = (context: AuthContextType) => {
  return isAuthenticated(context) && context.profile?.role === 'admin';
};
