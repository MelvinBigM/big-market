
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
        
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Identification de l'entreprise</h2>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Nom commercial :</span> BIG IMEX</li>
              <li>
                <span className="font-medium">Adresse :</span><br />
                45 ALLÉE DES ORMES<br />
                06250 MOUGINS<br />
                FRANCE
              </li>
              <li><span className="font-medium">SIRET :</span> 887 712 255 00033</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Téléphone :</span> +(4) 93 90 90 92</li>
              <li><span className="font-medium">E-mail :</span> contact@bigimex.fr</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Hébergement du site</h2>
            <p className="text-gray-600">
              Ce site est hébergé par Vercel Inc.<br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723<br />
              États-Unis
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Protection des données personnelles</h2>
            <p className="text-gray-600">
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, 
              vous disposez d'un droit d'accès, de modification et de suppression des données 
              vous concernant. Pour exercer ce droit, vous pouvez nous contacter par email 
              à l'adresse contact@bigimex.fr ou par courrier à l'adresse postale indiquée ci-dessus.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600">
              Ce site utilise des cookies nécessaires à son bon fonctionnement. 
              En continuant à naviguer sur ce site, vous acceptez leur utilisation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
