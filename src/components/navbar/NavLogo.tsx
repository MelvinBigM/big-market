
import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/" className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
          alt="Big Market Logo" 
          className="h-10 w-10"
        />
        <span className="text-2xl font-bold text-primary hidden sm:block">
          Big Market
        </span>
      </Link>
    </div>
  );
};

export default NavLogo;
