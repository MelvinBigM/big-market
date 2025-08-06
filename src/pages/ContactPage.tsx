
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact</h1>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Nos Coordonnées</h2>
                <div className="space-y-6">
                  <div className="flex items-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full mr-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-full text-center pr-12">
                      <p className="font-medium mb-1">Adresse</p>
                      <p className="text-gray-600">42 Chemin de l'escadrille</p>
                      <p className="text-gray-600">06210 Mandelieu</p>
                      <p className="text-gray-600">FRANCE</p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full mr-4">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-full text-center pr-12">
                      <p className="font-medium mb-1">Téléphone</p>
                      <p className="text-gray-600">04 93 90 90 92</p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full mr-4">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="w-full text-center pr-12">
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-gray-600">contact@bigimex.fr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Horaires d'ouverture</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                  <div className="p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <p className="font-medium text-lg mb-2">Lundi - Samedi</p>
                    <p className="text-gray-600 text-xl">8h00 - 16h00</p>
                  </div>
                  
                  <div className="p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <p className="font-medium text-lg mb-2">Dimanche</p>
                    <p className="text-gray-600 text-xl">Fermé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
