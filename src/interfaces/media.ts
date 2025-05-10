export interface Media {
  id: string;
  title: string;
  type: "movie" | "series";
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