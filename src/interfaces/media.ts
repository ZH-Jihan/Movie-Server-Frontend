export interface Media {
  id: string;
  title: string;
  type: "movie" | "series";
  releaseYear: number;
  price: number;
  purchaseOptions: {
    rent: {
      price: number;
      duration: string;
    };
    buy: {
      price: number;
    };
  };
}
