export interface MediaItem {
  id: string;
  title: string;
  type: "movie" | "series";
  posterUrl: string;
  rating: number;
  year: number;
  genres?: string[];
} 