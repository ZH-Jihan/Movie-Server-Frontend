"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/use-auth";
import { calculateDiscountedPrice, validateCoupon } from "@/services/coupon";
import { createPurchase } from "@/services/purchase";
import { Clock, Download, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

/**
 * PurchaseOptions: Displays purchase and rental options for a media item.
 * @param price - The price for buying the media
 * @param rentPrice - The price for renting the media
 * @param mediaId - The ID of the media
 * @param onPurchase - Callback when purchase is made
 * @param onRent - Callback when rent is made
 */
interface PurchaseOptionsProps {
  price: number;
  rentPrice?: number;
  mediaId: string;
  onPurchase?: () => void;
  onRent?: () => void;
}

export default function PurchaseOptions({
  price,
  rentPrice,
  mediaId,
  onPurchase,
  onRent,
}: PurchaseOptionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selected, setSelected] = useState<"buy" | "rent">("buy");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleCouponValidation = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      setCouponApplied(false);
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");
    setCouponApplied(false);

    try {
      const result = await validateCoupon(couponCode);
      if (result.isValid) {
        setDiscount(result.discount);
        setCouponApplied(true);
        toast({
          title: "Coupon applied!",
          description: `${result.discount}% discount applied to your purchase`,
        });
      } else {
        setCouponError(result.message);
        setDiscount(0);
        setCouponApplied(false);
      }
    } catch (error) {
      setCouponError("Failed to validate coupon");
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCouponInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setCouponError("");
    setCouponApplied(false);
    setDiscount(0);
  };

  const getDiscountedPrice = (base: number) =>
    discount > 0 ? calculateDiscountedPrice(base, discount) : base;

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to purchase this title",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await createPurchase({
        mediaId,
        type: selected.toUpperCase() as "RENT" | "BUY",
        discount: discount,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast({
          title: "Purchase failed",
          description: res.message,
          variant: "destructive",
        });
      }
      // if (onPurchase) onPurchase();
    } catch (err: any) {
      toast({
        title: "Purchase failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch Options</CardTitle>
        <CardDescription>Rent or buy to start watching now</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add coupon section */}
        <div className="space-y-2">
          <Label htmlFor="coupon">Have a coupon code?</Label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={handleCouponInputChange}
              disabled={isValidatingCoupon || isProcessing || couponApplied}
            />
            <Button
              variant="outline"
              onClick={handleCouponValidation}
              disabled={isValidatingCoupon || isProcessing || couponApplied}
            >
              Apply
            </Button>
          </div>
          {couponError ? (
            <p className="text-sm text-destructive">{couponError}</p>
          ) : couponApplied && discount > 0 ? (
            <p className="text-sm text-green-600">
              {discount}% discount applied!
            </p>
          ) : null}
        </div>

        <RadioGroup
          value={selected}
          onValueChange={(value) => setSelected(value as "rent" | "buy")}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="rent" id="rent" />
            <Label htmlFor="rent" className="flex-1 cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Rent</span>
                </div>
                <div className="flex flex-col items-end">
                  {discount > 0 && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${rentPrice}
                    </span>
                  )}
                  <div className="font-semibold">
                    ${getDiscountedPrice(rentPrice || 0)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Available for 48 hour after starting
              </p>
            </Label>
          </div>

          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="buy" id="buy" />
            <Label htmlFor="buy" className="flex-1 cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>Buy</span>
                </div>
                <div className="flex flex-col items-end">
                  {discount > 0 && (
                    <span className="text-sm line-through text-muted-foreground">
                      ${price}
                    </span>
                  )}
                  <div className="font-semibold">
                    ${getDiscountedPrice(price)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Own forever and watch anytime
              </p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full gap-2"
          onClick={handlePurchase}
          disabled={isProcessing || !user}
        >
          <ShoppingCart className="h-4 w-4" />
          {isProcessing
            ? "Processing..."
            : selected === "buy"
            ? "Purchase"
            : "Rent"}
        </Button>
      </CardFooter>
    </Card>
  );
}
