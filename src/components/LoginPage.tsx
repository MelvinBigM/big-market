
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
        <div className="flex flex-col space-y-4">
          <LoginActions />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
