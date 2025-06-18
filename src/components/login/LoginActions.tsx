
import { useNavigate } from "react-router-dom";
import ForgotPasswordDialog from "../ForgotPasswordDialog";

const LoginActions = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-2">
      <ForgotPasswordDialog />
      <p className="text-sm">
        Pas encore de compte ?{" "}
        <button
          type="button"
          className="text-primary hover:text-primary/90"
          onClick={() => navigate("/register")}
        >
          S'inscrire
        </button>
      </p>
    </div>
  );
};

export default LoginActions;
