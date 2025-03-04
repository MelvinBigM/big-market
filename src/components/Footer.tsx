
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BIG IMEX</h3>
            <p className="text-sm text-gray-600">
              Votre destination pour des produits alimentaires et des boissons de qualité.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos produits</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/sodas" className="text-sm text-gray-600 hover:text-primary">
                  Sodas
                </Link>
              </li>
              <li>
                <Link to="/categories/jus" className="text-sm text-gray-600 hover:text-primary">
                  Jus
                </Link>
              </li>
              <li>
                <Link to="/categories/eaux" className="text-sm text-gray-600 hover:text-primary">
                  Eaux
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-sm text-gray-600 hover:text-primary">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-sm text-gray-600 not-italic">
              <p>45 ALLÉE DES ORMES</p>
              <p>06250 MOUGINS</p>
              <p>FRANCE</p>
              <p className="mt-2">contact@bigimex.fr</p>
              <p>04 93 90 90 92</p>
            </address>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} BIG IMEX. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
