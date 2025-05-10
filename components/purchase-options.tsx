"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/use-auth"
import { ShoppingCart, Download, Clock } from "lucide-react"

interface Media {
  id: string
  title: string
  type: "movie" | "series"
  purchaseOptions: {
    rent: {
      price: number
      duration: string
    }
    buy: {
      price: number
    }
  }
}

interface PurchaseOptionsProps {
  media: Media
}

export default function PurchaseOptions({ media }: PurchaseOptionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [purchaseType, setPurchaseType] = useState<"rent" | "buy">("rent")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to purchase this title",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Purchase successful",
        description:
          purchaseType === "rent"
            ? `You have rented "${media.title}" for ${media.purchaseOptions.rent.duration}`
            : `You have purchased "${media.title}"`,
      })
      setIsProcessing(false)

      // In a real app, redirect to the streaming page
      // router.push(`/watch/${media.id}`);
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch Options</CardTitle>
        <CardDescription>Rent or buy to start watching now</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={purchaseType}
          onValueChange={(value) => setPurchaseType(value as "rent" | "buy")}
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
                <div className="font-semibold">${media.purchaseOptions.rent.price.toFixed(2)}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Available for {media.purchaseOptions.rent.duration} after starting
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
                <div className="font-semibold">${media.purchaseOptions.buy.price.toFixed(2)}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Own forever and watch anytime</p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" onClick={handlePurchase} disabled={isProcessing}>
          <ShoppingCart className="h-4 w-4" />
          {isProcessing
            ? "Processing..."
            : purchaseType === "rent"
              ? `Rent for $${media.purchaseOptions.rent.price.toFixed(2)}`
              : `Buy for $${media.purchaseOptions.buy.price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
