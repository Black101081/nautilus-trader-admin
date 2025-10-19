import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoadingWrapperProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingText?: string;
  errorTitle?: string;
}

export const LoadingWrapper = React.memo(function LoadingWrapper({
  isLoading,
  error,
  children,
  loadingText = "Loading...",
  errorTitle = "Error",
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{loadingText}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
});

