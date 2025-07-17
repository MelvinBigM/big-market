
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { profile, isLoading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only act when loading is complete
    if (!isLoading) {
      if (!session) {
        console.log("No session, redirecting to login");
        navigate('/login');
        toast.error("Vous devez être connecté pour accéder à cette page");
        return;
      }
      
      if (!profile) {
        console.log("No profile found, but session exists - profile may be loading");
        return; // Don't redirect yet if profile is still loading
      }
      
      if (profile.role !== 'admin') {
        console.log("User is not admin, redirecting to home");
        navigate('/');
        toast.error("Accès non autorisé");
        return;
      }
    }
  }, [profile, isLoading, session, navigate]);

  // Show loading while determining auth status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Show loading if session exists but profile is still loading
  if (session && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Don't render if conditions aren't met (redirects will handle navigation)
  if (!session || !profile || profile.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
