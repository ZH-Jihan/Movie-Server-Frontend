"use client"

import { useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ReviewListProps {
  mediaId: string
  mediaType: "movie" | "series"
}

export default function ReviewList({ mediaId, mediaType }: ReviewListProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock reviews data - in a real app, this would come from an API
  const reviews = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 8,
      text: "This was an amazing movie with great performances and stunning visuals. The storyline kept me engaged throughout and the ending was satisfying. Highly recommend to anyone who enjoys this genre!",
      date: "2 days ago",
      likes: 24,
      comments: 5,
      isSpoiler: false,
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 6,
      text: "While the acting was solid, I found the pacing to be a bit slow in the middle. The cinematography was beautiful though, and the soundtrack really enhanced the emotional moments.",
      date: "1 week ago",
      likes: 12,
      comments: 2,
      isSpoiler: true,
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "Alex Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 9,
      text: "One of the best films I've seen this year! The director did an excellent job bringing this story to life, and the performances were outstanding across the board.",
      date: "2 weeks ago",
      likes: 36,
      comments: 8,
      isSpoiler: false,
    },
  ]

  const handleRatingClick = (rating: number) => {
    setUserRating(rating)
  }

  const handleRatingHover = (rating: number) => {
    setHoverRating(rating)
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Review submitted",
        description: "Your review has been submitted for approval",
      })
      setUserRating(0)
      setReviewText("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Write a review section */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Your Rating</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md transition-colors",
                  rating <= userRating || rating <= hoverRating
                    ? "bg-yellow-500 text-yellow-950"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => handleRatingHover(rating)}
                onMouseLeave={() => setHoverRating(0)}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Share your thoughts about this title..."
          className="mb-4 min-h-[100px]"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <div className="flex justify-end">
          <Button onClick={handleSubmitReview} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">User Reviews</h3>

        {reviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.image || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{review.user.name}</div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="font-medium">{review.rating}/10</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-3">{review.date}</div>

                {review.isSpoiler ? (
                  <div className="mb-3">
                    <Button variant="outline" size="sm">
                      Show Spoiler Review
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm mb-3">{review.text}</p>
                )}

                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{review.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />
          </div>
        ))}

        <div className="flex justify-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </div>
  )
}
