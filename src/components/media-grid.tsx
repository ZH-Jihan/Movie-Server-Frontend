import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MediaItem } from "@/interfaces/media-item";
import { Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaGridProps {
  items: MediaItem[];
  ratings: Record<string, number>;
  loading?: boolean;
}

export default function MediaGrid({ items, ratings, loading }: MediaGridProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[2/3] mb-2" />
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {items?.map((item) => (
          <Link
            key={item.id}
            href={`/${item.type === "series" ? "series" : "movies"}/${item.id}`}
          >
            <Card className="overflow-hidden w-full group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0 relative aspect-[2/3] w-full">
                <Image
                  src={item.posterUrl || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="rounded-full bg-primary/90 p-3">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{ratings[item.id] ?? 0}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-xs"
                >
                  {item.type}
                </Badge>
              </CardContent>
              <div className="p-3">
                <h3 className="font-medium line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.releaseYear}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
