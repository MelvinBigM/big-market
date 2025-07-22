
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ProfileForm from "./profile/ProfileForm";

const ProfilePage = () => {
  const { session, isLoading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure there's no session and not loading
    if (!isLoading && !session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
    }
  }, [session, isLoading, navigate]);

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <main className="flex-1 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement de votre profil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render anything if no session (redirect will happen)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Mon Profil</h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          {/* Show loading if profile is still being fetched */}
          {!profile ? (
            <div className="bg-card rounded-lg shadow p-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Chargement des informations...</span>
              </div>
            </div>
          ) : (
            <ProfileForm />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
