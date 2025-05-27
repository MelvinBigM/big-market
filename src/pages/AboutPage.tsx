import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { GlobeIcon, HeartHandshake, ShieldCheck, Users, Clock } from "lucide-react";
const AboutPage = () => {
  return <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="py-16 bg-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de Big Market</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Votre partenaire de confiance pour l'importation et l'exportation de produits alimentaires et boissons de qualité depuis 2015.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our values section */}
          <section>
            <div className="flex items-center mb-6">
              <HeartHandshake className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Nos Valeurs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Qualité & Fiabilité</h3>
                <p className="text-gray-600">
                  Nous sélectionnons minutieusement chaque produit pour garantir une qualité irréprochable et constante.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Service Client</h3>
                <p className="text-gray-600">
                  Nous plaçons la satisfaction de nos clients au cœur de notre activité et nous engageons à offrir un service personnalisé et réactif.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Réactivité</h3>
                <p className="text-gray-600">
                  Nous nous adaptons rapidement aux besoins de nos clients et aux évolutions du marché pour proposer des solutions optimales.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center text-center">
                <GlobeIcon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Développement Durable</h3>
                <p className="text-gray-600">
                  Nous nous engageons à adopter des pratiques commerciales responsables et à minimiser notre impact environnemental.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>;
};
export default AboutPage;