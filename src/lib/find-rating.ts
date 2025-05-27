import { getMediaById } from "@/services/media";

/**
 * Utility function to fetch the rating for a given media ID.
 * This function is reusable and can be used in both server-side and client-side components.
 * @param id - The ID of the media item.
 * @returns A promise that resolves to the average rating of the media item or 0 if an error occurs.
 */
export async function findRating(id: string): Promise<number> {
  try {
    const { data } = await getMediaById(id);
    return data?.avgRating || 0;
  } catch (error) {
    console.error(`Error fetching rating for ID ${id}:`, error);
    return 0; // Default rating if fetch fails
  }
}
