
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">À propos de BIG IMEX</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Histoire</h2>
            <p className="text-gray-600 mb-4">
              BIG IMEX est une entreprise spécialisée dans l'importation et l'exportation de produits alimentaires et de boissons. 
              Basée à Mougins, nous servons nos clients avec une sélection soigneusement choisie de produits de qualité.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-600 mb-4">
              Notre mission est de fournir à nos clients les meilleurs produits alimentaires et boissons, 
              en maintenant des standards élevés de qualité et un service client exceptionnel.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nos Valeurs</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Qualité des produits</li>
              <li>Satisfaction client</li>
              <li>Innovation</li>
              <li>Développement durable</li>
              <li>Transparence</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
