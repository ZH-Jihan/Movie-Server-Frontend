"use client";

// ReviewList: Displays and manages user reviews, likes, and comments for a media item.
// Includes review submission, like/unlike, and comment functionality.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Review, ReviewLike } from "@/interfaces/review";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import {
  getReviewsByMediaId,
  likeReview,
  postComment,
  postReview,
  unlikeReview,
} from "@/services/review";
import { Flag, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReviewListProps {
  mediaId: string;
  mediaType: "MOVIE" | "SERIES";
}

export default function ReviewList({ mediaId, mediaType }: ReviewListProps) {
  // Auth and navigation
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // State for review form and review list
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [spoiler, setSpoiler] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{
    [reviewId: string]: string;
  }>({});
  const [likeLoading, setLikeLoading] = useState<{
    [reviewId: string]: boolean;
  }>({});
  const [openComments, setOpenComments] = useState<{
    [reviewId: string]: boolean;
  }>({});

  // Fetch reviews on mount or when mediaId changes
  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const data = await getReviewsByMediaId(mediaId, async () => {
          signOut();
          router.push("/login");
        });
        setReviews(data);
      } catch (e: any) {
        toast({
          title: "Error",
          description: e?.message || "Failed to load reviews",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [mediaId, toast, signOut, router]);

  // Handle rating selection
  const handleRatingClick = (rating: number) => setUserRating(rating);
  const handleRatingHover = (rating: number) => setHoverRating(rating);

  // Handle tag input for review form
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setTags([...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };
  const handleRemoveTag = (tag: string) =>
    setTags(tags.filter((t) => t !== tag));

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await postReview(
        { mediaId, rating: userRating, text: reviewText, spoiler, tags },
        async () => {
          await signOut();
          router.push("/login");
        }
      );
      toast({
        title: "Review submitted",
        description: "Your review has been submitted for approval",
      });
      setUserRating(0);
      setReviewText("");
      setTags([]);
      setSpoiler(false);
      // Refresh reviews
      const data = await getReviewsByMediaId(mediaId, async () => {
        await signOut();
        router.push("/login");
      });
      setReviews(data);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like/unlike a review (optimistic UI update)
  const handleLike = async (review: Review) => {
    setLikeLoading((prev) => ({ ...prev, [review.id]: true }));
    const hasLiked = review.likes.some((like) => like.userId === user?.id);
    // Optimistically update UI
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.id === review.id
          ? {
              ...r,
              likes: hasLiked
                ? r.likes.filter((like) => like.userId !== user?.id)
                : [
                    ...r.likes,
                    {
                      id: "temp",
                      user: {
                        id: user!.id,
                        name: user!.name || "",
                        image: user!.image,
                      },
                      userId: user!.id,
                      reviewId: review.id,
                      createdAt: new Date().toISOString(),
                    } as ReviewLike,
                  ],
            }
          : r
      )
    );
    try {
      if (hasLiked) {
        await unlikeReview(review.id, async () => {
          await signOut();
          router.push("/login");
        });
      } else {
        await likeReview(review.id, async () => {
          await signOut();
          router.push("/login");
        });
      }
      // Refresh reviews
      const data = await getReviewsByMediaId(mediaId, async () => {
        await signOut();
        router.push("/login");
      });
      setReviews(data);
    } catch (e: any) {
      // Revert optimistic update on error
      setReviews((prevReviews) =>
        prevReviews.map((r) => (r.id === review.id ? review : r))
      );
      toast({
        title: "Error",
        description: e?.message || "Failed to update like",
        variant: "destructive",
      });
    } finally {
      setLikeLoading((prev) => ({ ...prev, [review.id]: false }));
    }
  };

  // Handle comment input and posting
  const handleCommentInput = (reviewId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [reviewId]: value }));
  };
  const handlePostComment = async (reviewId: string) => {
    const text = commentInputs[reviewId]?.trim();
    if (!text) return;
    try {
      await postComment(reviewId, text, undefined, async () => {
        await signOut();
        router.push("/login");
      });
      setCommentInputs((prev) => ({ ...prev, [reviewId]: "" }));
      // Refresh reviews
      const data = await getReviewsByMediaId(mediaId, async () => {
        await signOut();
        router.push("/login");
      });
      setReviews(data);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  // --- Render ---
  return (
    <div className="space-y-8">
      {/* Review submission form */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        {/* Rating selection */}
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
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
        {/* Review text input */}
        <Textarea
          placeholder="Share your thoughts about this title..."
          className="mb-4 min-h-[100px]"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        {/* Tag input */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Add tag and press Enter"
            className="border rounded px-2 py-1 text-sm"
            onKeyDown={handleTagInput}
          />
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        {/* Spoiler checkbox */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="spoiler"
            checked={spoiler}
            onChange={(e) => setSpoiler(e.target.checked)}
          />
          <label htmlFor="spoiler" className="text-sm">
            Mark as spoiler
          </label>
        </div>
        {/* Submit button */}
        <div className="flex justify-end">
          <Button onClick={handleSubmitReview} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">User Reviews</h3>
        {/* Show loading spinner while loading */}
        {loading ? (
          <LoadingSpinner size={40} />
        ) : reviews.length === 0 ? (
          <div className="text-muted-foreground">No reviews yet.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              <div className="flex gap-4">
                {/* User avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={review.user.image || "/placeholder.svg"}
                    alt={review.user.name}
                  />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {/* User name and rating */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{review.user.name}</div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="font-medium">{review.rating}/10</span>
                    </div>
                  </div>
                  {/* Review date */}
                  <div className="text-sm text-muted-foreground mb-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                  {/* Tags and spoiler label */}
                  <div className="mb-2 flex flex-wrap gap-1">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-2 py-0.5 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {review.spoiler && (
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs">
                        Spoiler
                      </span>
                    )}
                  </div>
                  {/* Spoiler review toggle or review text */}
                  {review.spoiler ? (
                    <div className="mb-3">
                      <Button variant="outline" size="sm">
                        Show Spoiler Review
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm mb-3">{review.text}</p>
                  )}
                  {/* Like, comment, and flag buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleLike(review)}
                      disabled={likeLoading[review.id]}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes?.length ?? 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() =>
                        setOpenComments((prev) => ({
                          ...prev,
                          [review.id]: !prev[review.id],
                        }))
                      }
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{review.comments?.length ?? 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Show comment input and comments only if open */}
                  {openComments[review.id] && (
                    <>
                      {/* Comment input */}
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="border rounded px-2 py-1 text-sm w-2/3"
                          value={commentInputs[review.id] || ""}
                          onChange={(e) =>
                            handleCommentInput(review.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handlePostComment(review.id);
                          }}
                        />
                        <Button
                          size="sm"
                          className="ml-2"
                          onClick={() => handlePostComment(review.id)}
                          disabled={!commentInputs[review.id]?.trim()}
                        >
                          Post
                        </Button>
                      </div>
                      {/* Comments list */}
                      {review?.comments?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {review?.comments?.map((comment) => (
                            <div
                              key={comment.id}
                              className="text-xs text-muted-foreground pl-2 border-l"
                            >
                              <span className="font-medium">
                                {comment?.user?.name}:
                              </span>{" "}
                              {comment?.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </div>
          ))
        )}
        <div className="flex justify-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </div>
    </div>
  );
}
