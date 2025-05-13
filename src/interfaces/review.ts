export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  userId: string;
  reviewId: string;
  parentId?: string;
  replies: Comment[];
}

export interface ReviewLike {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  userId: string;
  reviewId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number; // 1 to 10
  text?: string;
  spoiler: boolean;
  tags: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  userId: string;
  mediaId: string;
  comments: Comment[];
  likes: ReviewLike[];
}
