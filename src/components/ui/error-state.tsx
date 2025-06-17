
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  retryLabel?: string;
}

const ErrorState = ({ 
  message = "Une erreur est survenue", 
  onRetry,
  className,
  retryLabel = "Réessayer"
}: ErrorStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 py-12",
      className
    )}>
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-gray-600 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
