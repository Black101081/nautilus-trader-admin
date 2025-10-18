import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar />
      <main className={cn("ml-16 md:ml-64 flex-1 transition-all duration-300 w-full", className)}>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

