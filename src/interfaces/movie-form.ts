export interface MovieFormState {
  title: string;
  description: string;
  type: "MOVIE" | "SERIES";
  genres: string[];
  releaseYear: number;
  duration: number;
  price: number;
  rentPrice: number;
  streamingLink: string;
  drmProtected: boolean;
  isPublished: boolean;
  image?: string;
  trailerUrl?: string;
  coverImage?: string;
  screenshots?: string[];
}
