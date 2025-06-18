
import { useLogin } from "@/hooks/useLogin";
import LoginHeader from "./login/LoginHeader";
import LoginForm from "./login/LoginForm";
import LoginActions from "./login/LoginActions";

const LoginPage = () => {
  const {
    email,
    password,
    isLoading,
    emailError,
    passwordError,
    loginFormSubmitted,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
  } = useLogin();

  return (
    <div className="min-h-screen h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <LoginHeader />
        <LoginForm
          email={email}
          password={password}
          isLoading={isLoading}
          emailError={emailError}
          passwordError={passwordError}
          loginFormSubmitted={loginFormSubmitted}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleLogin}
        />
        <LoginActions />
      </div>
    </div>
  );
};

export default LoginPage;
