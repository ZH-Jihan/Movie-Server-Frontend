import { API_BASE_URL } from "@/lib/api";
import { token } from "../auth";

export const createPurchase = async (data: {
  mediaId: string;
  type: "RENT" | "BUY";
  discount: number;
}) => {
  const tkn = await token();
  const res = await fetch(`${API_BASE_URL}/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tkn?.value}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUserPurchases = async () => {
  const tkn = await token();
  const res = await fetch(`${API_BASE_URL}/purchases/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
  });
  return res.json();
};

export const getPurchaseByTransactionId = async (transactionId: string) => {
  const res = await fetch(`${API_BASE_URL}/purchases/${transactionId}`, {
    method: "GET",
  });
  return res.json();
};
