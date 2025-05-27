import {
  Comment,
  Review,
  ReviewLike,
  TPandingReview,
} from "@/interfaces/review";
import { API_BASE_URL } from "@/lib/api";
import { apiFetch } from "@/lib/fetcher";
import { token } from "../auth";

export async function getAllReviews(
  onJwtExpired?: () => void
): Promise<TPandingReview[]> {
  const tkn = await token();
  return apiFetch(`${API_BASE_URL}/review`, {
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
    onJwtExpired,
  }).then((data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    return [];
  });
}
export async function getReviewsByMediaId(
  mediaId: string,
  onJwtExpired?: () => void
): Promise<Review[]> {
  return apiFetch(`${API_BASE_URL}/review/${mediaId}`, { onJwtExpired }).then(
    (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.data)) return data.data;
      return [];
    }
  );
}

export async function postReview(
  data: {
    mediaId: string;
    rating: number;
    text?: string;
    spoiler?: boolean;
    tags?: string[];
  },
  onJwtExpired?: () => void
): Promise<Review> {
  const tkn = await token();
  return apiFetch(`${API_BASE_URL}/review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
    body: JSON.stringify(data),
    onJwtExpired,
  });
}

export async function likeReview(
  reviewId: string,
  onJwtExpired?: () => void
): Promise<ReviewLike> {
  const tkn = await token();
  return apiFetch(`${API_BASE_URL}/review/${reviewId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
    onJwtExpired,
  });
}

export async function unlikeReview(
  reviewId: string,
  onJwtExpired?: () => void
): Promise<{ success: boolean }> {
  const tkn = await token();
  return apiFetch(`${API_BASE_URL}/review/${reviewId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
    onJwtExpired,
  });
}

export async function postComment(
  reviewId: string,
  text: string,
  parentId?: string,
  onJwtExpired?: () => void
): Promise<Comment> {
  const tkn = await token();
  return apiFetch(`${API_BASE_URL}/comment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tkn?.value}`,
    },
    body: JSON.stringify({ text, parentId, reviewId }),
    onJwtExpired,
  });
}
