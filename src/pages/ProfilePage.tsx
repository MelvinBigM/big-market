
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "@/components/navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDisplay from "@/components/profile/ProfileDisplay";
import { useProfileData } from "@/hooks/useProfileData";

const ProfilePage = () => {
  const { session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Utiliser le hook customisé pour gérer les données du profil
  const { 
    userData, 
    formData, 
    isLoading: profileDataLoading, 
    isEditing, 
    setIsEditing, 
    handleInputChange, 
    handleCheckboxChange, 
    handleSubmit 
  } = useProfileData();

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!session && !authLoading) {
      navigate("/login");
    }
  }, [session, authLoading, navigate]);

  // Page de chargement pendant la vérification de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p>Vérification de l'authentification...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirection si l'utilisateur n'est pas connecté
  if (!session && !authLoading) {
    return null;
  }

  // Page de chargement pendant la récupération des données du profil
  if (profileDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p>Chargement des informations...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                />
              ) : (
                <ProfileDisplay userData={userData} profile={useAuth().profile} />
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit}>
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
