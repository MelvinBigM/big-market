
interface RegistrationErrorDisplayProps {
  error: string;
}

const RegistrationErrorDisplay = ({ error }: RegistrationErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default RegistrationErrorDisplay;
