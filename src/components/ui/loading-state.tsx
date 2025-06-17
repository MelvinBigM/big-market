
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingState = ({ 
  message = "Chargement...", 
  className,
  size = "md" 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 py-12",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default LoadingState;
