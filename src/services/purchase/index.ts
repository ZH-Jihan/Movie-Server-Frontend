import axios from "axios";

export const createPurchase = async (data: {
  userId: string;
  mediaId: string;
  type: "RENT" | "BUY";
  price: number;
  paymentMethodId: string;
}) => {
  const res = await axios.post("/api/purchases", data);
  return res.data;
};

export const getUserPurchases = async (userId: string) => {
  const res = await axios.get(`/api/purchases/user/${userId}`);
  return res.data;
};

export const updatePurchaseStatus = async (id: string, status: string) => {
  const res = await axios.patch(`/api/purchases/${id}/status`, { status });
  return res.data;
};
