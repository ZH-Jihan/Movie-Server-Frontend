"use server";

import { MediaItem } from "@/interfaces/media-item";
import { API_BASE_URL } from "@/lib/api";
import { token } from "../auth";

export async function uploadMedia(data: FormData) {
  try {
    const tkn = await token();

    const response = await fetch(`${API_BASE_URL}/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tkn?.value}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Media upload failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

interface MediaQuery {
  [key: string]: string | number | boolean | undefined | null;
}

interface MediaResponse {
  success: boolean;
  massage: string;
  data: MediaItem[];
}

export async function getAllMedia(query: MediaQuery): Promise<MediaResponse> {
  try {
    const queryString = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await fetch(`${API_BASE_URL}/media?${queryString}`, {
      method: "GET",
      next: {
        revalidate: 3600,
      },
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function getTopRated(): Promise<MediaResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/media/features`, {
      method: "GET",
      next: {
        revalidate: 3600,
      },
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getMediaById(id: string): Promise<{
  success: boolean;
  massage: string;
  data: { media: MediaItem; avgRating: number };
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getRating(id: string) {
  let rating = 0;
  const media = async () => {
    const { data } = await getMediaById(id);
    rating = data?.avgRating || 0;
  };
  media().catch((error) => {
    console.error("Error fetching media rating:", error);
  });
  return rating;
}
