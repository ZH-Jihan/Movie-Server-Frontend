import { API_BASE_URL } from "@/lib/api";

interface CouponResponse {
  isValid: boolean;
  discount: number;
  message: string;
}

export async function validateCoupon(code: string): Promise<CouponResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/coupons/validate/${code}`
    );
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
