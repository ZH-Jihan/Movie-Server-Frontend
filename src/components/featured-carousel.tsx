"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MediaItem } from "@/interfaces/media-item";
import { cn } from "@/lib/utils";
import { addWatchLinst } from "@/services/media";
import { Play, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FeaturedCarouselProps {
  items: MediaItem[];
  rating: Record<string, number>;
}

export default function FeaturedCarousel({
  items,
  rating,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [items.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items.length) return null;

  const handleAddToWatchlist = async (id: string) => {
    const response = await addWatchLinst(id);
    console.log(response);
    if (response.success) {
      toast({
        title: "Success",
        description: response.message,
      });
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: response.message,
      });
    }
  };

  return (
    <div className="relative h-[500px] md:h-[450px] overflow-hidden rounded-xl">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <Image
            src={item.coverImage || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {item.type === "MOVIE" ? "Movie" : "TV Series"}
              </Badge>
              <div className="flex items-center text-yellow-500">
                <Star className="fill-yellow-500 h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {rating[item.id] ?? 0}
                </span>
              </div>
              <span className="bg-gray-600 text-white px-2 py-1 text-sm rounded-2xl">
                {item.releaseYear}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
              {item.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {item.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="bg-background/20 backdrop-blur-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  router.push(
                    `/${item.type === "MOVIE" ? "movies" : "series"}/${item.id}`
                  )
                }
                size="lg"
                className="gap-2"
              >
                <Play className="h-4 w-4" /> Watch Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => handleAddToWatchlist(item.id)}
              >
                <Plus className="h-4 w-4" /> Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-primary w-6" : "bg-muted"
            )}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
