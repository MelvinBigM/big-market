
import { usePasswordReset } from "./reset-password/hooks/usePasswordReset";
import ResetPasswordLoadingState from "./reset-password/ResetPasswordLoadingState";
import ResetPasswordInvalidState from "./reset-password/ResetPasswordInvalidState";
import ResetPasswordSuccessState from "./reset-password/ResetPasswordSuccessState";
import ResetPasswordForm from "./reset-password/ResetPasswordForm";

const ResetPasswordPage = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isValidSession,
    isCheckingSession,
    passwordUpdated,
    handleResetPassword
  } = usePasswordReset();

  if (isCheckingSession) {
    return <ResetPasswordLoadingState />;
  }

  if (!isValidSession) {
    return <ResetPasswordInvalidState />;
  }

  if (passwordUpdated) {
    return <ResetPasswordSuccessState />;
  }

  return (
    <ResetPasswordForm
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      onSubmit={handleResetPassword}
    />
  );
};

export default ResetPasswordPage;
