import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Loading() {
  // Global loading spinner shown during route transitions or initial data fetch
  return <LoadingSpinner size={50} />;
}
