
const ResetPasswordSuccessState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
            alt="Big Market Logo"
            className="h-24 w-24 mb-4"
          />
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Mot de passe modifié !
          </h2>
          <p className="mt-2 text-gray-600">
            Votre mot de passe a été mis à jour avec succès.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Redirection en cours vers la page de connexion...
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessState;
