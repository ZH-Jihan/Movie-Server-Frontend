import { CouponData } from "@/app/admin/coupons/page";
import { API_BASE_URL } from "@/lib/api";
import { token } from "../auth";

interface CouponResponse {
  isValid: boolean;
  discount: number;
  message: string;
}
interface TResponse {
  data: CouponData[];
  status: boolean;
  message: string;
}

export async function createCoupon(coupon: any): Promise<TResponse> {
  const tkn = await token();
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tkn?.value}`,
    },
    body: JSON.stringify(coupon),
  });
  return response.json();
}

export async function getAllCoupons(): Promise<TResponse> {
  const tkn = await token();
  const response = await fetch(`${API_BASE_URL}/coupons`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
  });
  return response.json();
}

export async function validateCoupon(code: string): Promise<CouponResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/validate/${code}`);
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    return {
      isValid: false,
      discount: 0,
      message: error.response?.data?.message || "Invalid coupon code",
    };
  }
}

export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number
): number {
  const discount = (price * discountPercentage) / 100;
  return Number((price - discount).toFixed(2));
}
