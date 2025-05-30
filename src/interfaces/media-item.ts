export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: string;
  posterUrl: string;
  genres: string[];
  releaseYear: number;
  duration: number;
  price: number;
  rentPrice: number;
  streamingLink: string;
  drmProtected: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  screenshots: string[];
  coverImage: string;
  trailerUrl: string;
  purchaseOptions?: {
    rent?: {
      price: number;
      duration: string;
    };
    buy?: {
      price: number;
    };
  };
}
