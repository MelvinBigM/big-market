
import { useAuth } from "@/lib/auth";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ProfileForm from "./profile/ProfileForm";

const ProfilePage = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès non autorisé
            </h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <ProfileForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
