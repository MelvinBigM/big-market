
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Building, Clock, GlobeIcon, HeartHandshake, ShieldCheck, Users } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de BIG IMEX</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Votre partenaire de confiance pour l'importation et l'exportation de produits alimentaires et boissons de qualité depuis 2015.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our story section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Building className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Notre Histoire</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Fondée en 2015, BIG IMEX est née de la passion de proposer des produits alimentaires et des boissons de qualité supérieure. Basée à Mandelieu dans les Alpes-Maritimes, notre entreprise s'est progressivement imposée comme un acteur incontournable dans le secteur de l'import-export alimentaire.
              </p>
              <p>
                Au fil des années, nous avons développé un réseau de fournisseurs et de partenaires fiables à travers le monde, nous permettant de proposer une gamme diversifiée de produits sélectionnés avec soin pour leur qualité exceptionnelle.
              </p>
            </div>
          </section>
          
          {/* Our mission section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <GlobeIcon className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Notre Mission</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Notre mission est simple : fournir à nos clients les meilleurs produits alimentaires et boissons du monde entier, tout en assurant un service irréprochable et personnalisé.
              </p>
              <p>
                Nous nous efforçons de créer des relations durables avec nos clients et nos fournisseurs, basées sur la confiance, la qualité et l'excellence du service. Notre objectif est de rendre accessibles des produits de qualité supérieure tout en respectant les normes les plus strictes en matière de sécurité alimentaire.
              </p>
            </div>
          </section>
          
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
    </div>
  );
};

export default AboutPage;
