export interface MovieFormState {
  title: string;
  description: string;
  type: "movie" | "series";
  genres: string[];
  releaseYear: number;
  duration: number;
  price: number;
  rentPrice: number;
  streamingLink: string;
  drmProtected: boolean;
  isPublished: boolean;
  image?: string;
} 