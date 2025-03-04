
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "@/components/navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import { useProfileData } from "@/hooks/useProfileData";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Use the custom hook to manage profile data and interactions
  const { 
    userData, 
    formData, 
    isLoading: profileDataLoading, 
    isError,
    isEditing, 
    setIsEditing, 
    isSubmitting,
    handleInputChange, 
    handleCheckboxChange, 
    handleSubmit,
    refetchProfile
  } = useProfileData();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!session && !authLoading) {
      navigate("/login");
    }
  }, [session, authLoading, navigate]);

  // Handle data refresh when page loads
  useEffect(() => {
    if (session && !profileDataLoading && !isEditing) {
      refetchProfile();
    }
  }, [session, profileDataLoading, isEditing, refetchProfile]);

  // Show loading state during authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2">Vérification de l'authentification...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!session && !authLoading) {
    return null;
  }

  // Show loading state during profile data fetching
  if (profileDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2">Chargement des informations...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if profile data fetching failed
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Erreur</CardTitle>
                <CardDescription>
                  Une erreur est survenue lors du chargement de votre profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-500 mb-4">Impossible de charger les données du profil.</p>
                <Button onClick={refetchProfile}>Réessayer</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get profile data from auth context for displaying account type
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Ces informations sont utilisées pour les commandes et livraisons
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <ProfileForm 
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleCheckboxChange={handleCheckboxChange}
                  handleSubmit={handleSubmit}
                  onCancel={() => setIsEditing(false)}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <>
                  <ProfileDisplay userData={userData} profile={profile} />
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setIsEditing(true)}>
                      Modifier
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
