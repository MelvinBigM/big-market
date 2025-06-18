
import { usePasswordReset } from "./reset-password/hooks/usePasswordReset";
import ResetPasswordLoadingState from "./reset-password/ResetPasswordLoadingState";
import ResetPasswordInvalidState from "./reset-password/ResetPasswordInvalidState";
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
    handleResetPassword
  } = usePasswordReset();

  if (isCheckingSession) {
    return <ResetPasswordLoadingState />;
  }

  if (!isValidSession) {
    return <ResetPasswordInvalidState />;
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
