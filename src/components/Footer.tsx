
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Informations on the left */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-sm text-muted-foreground hover:text-primary">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
          
          {/* BIG Market in the center */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 text-foreground">Big Market</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre destination pour des produits alimentaires et des boissons de qualité.
            </p>
            <div className="mt-6">
              <img 
                src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
                alt="Big Market Logo" 
                className="h-12 w-auto" 
              />
            </div>
          </div>
          
          {/* Contact on the right - restored to original format */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <address className="text-sm text-muted-foreground not-italic">
              <p>42 Chemin de l'escadrille</p>
              <p>06210 Mandelieu</p>
              <p>FRANCE</p>
              <p className="mt-2">contact@bigimex.fr</p>
              <p>04 93 90 90 92</p>
            </address>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Big Market. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
