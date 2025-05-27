import LoadingSpinner from "@/components/ui/loading-spinner";
import { Film } from "lucide-react";

export default function Loading() {
  // Branded splash screen with logo, spinner, and tagline
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Film className="h-6 w-6" />
      <span className="font-semibold">CineVerse</span>
      <LoadingSpinner size={50} />
      <div className="mt-6 text-lg font-semibold text-white">CineVerse</div>
      <div className="text-muted-foreground mt-2 text-white">
        Your gateway to movies & series
      </div>
    </div>
  );
}
