
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
    if (!isLoading) {
      if (!session) {
        navigate('/login');
        toast.error("Vous devez être connecté pour accéder à cette page");
        return;
      }
      
      if (!profile || profile.role !== 'admin') {
        navigate('/');
        toast.error("Accès non autorisé");
        return;
      }
    }
  }, [profile, isLoading, session, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile || profile.role !== 'admin') {
    return null; // Le useEffect va rediriger
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
