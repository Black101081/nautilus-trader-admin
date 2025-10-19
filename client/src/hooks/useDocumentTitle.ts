import { useEffect } from "react";

/**
 * Custom hook to set document title
 * @param title - The title to set
 * @param suffix - Optional suffix (default: "Nautilus Trader")
 */
export function useDocumentTitle(title: string, suffix = "Nautilus Trader") {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | ${suffix}`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}

