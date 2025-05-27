import MediaGrid from "@/components/media-grid";
import PurchaseOptions from "@/components/purchase-options";
import ReviewList from "@/components/review-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findRating } from "@/lib/find-rating";
import { getAllMedia, getMediaById } from "@/services/media";
import { Calendar, Clock, Play, Plus, Star, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CommonDetailsPageProps {
  id: string;
  type: "MOVIE" | "SERIES";
}

export default async function CommonDetailsPage({
  id,
  type,
}: CommonDetailsPageProps) {
  const { data } = await getMediaById(id);
  const media = data.media;
  const { data: relatedMedia } = media.type
    ? await getAllMedia({ type: media?.type })
    : { data: [] };

  if (!media) {
    return <div>{type === "MOVIE" ? "Movie" : "Series"} not found</div>;
  }

  const ratings: { [key: string]: any } = {};
  for (const item of relatedMedia) {
    ratings[item.id] = await findRating(item.id);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <Image
          src={"/placeholder.svg"}
          alt={media?.title || "Media background"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end z-20">
          <div className="container px-6 pb-8 flex flex-col md:flex-row gap-8">
            <div className="w-64 h-96 rounded-lg hidden md:block overflow-hidden shadow-md flex-shrink-0">
              <Image
                src={media?.posterUrl || "/placeholder.svg"}
                alt={media?.title || "Media poster"}
                width={256}
                height={384}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {type === "MOVIE" ? "Movie" : "Series"}
                </Badge>
                <div className="flex items-center text-yellow-400">
                  <Star className="fill-yellow-400 h-5 w-5 mr-1" />
                  <span className="text-lg font-semibold">{5.0}</span>
                </div>
                <span className="text-sm text-gray-300">
                  {media.releaseYear}
                </span>
                <span className="text-sm text-gray-300">{media.duration}</span>
              </div>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                {media.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {media?.genres?.map((genre: string) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="text-sm px-3 py-1 border-gray-400 text-gray-300"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 mb-6 max-w-3xl leading-relaxed hidden md:block ">
                {media.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="gap-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg shadow-md"
                >
                  <Play className="h-5 w-5" /> Watch Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-3 border-gray-300 text-gray-300 hover:border-white hover:text-white px-6 py-3 rounded-lg"
                >
                  <Plus className="h-5 w-5" /> Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="about" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                  <p className="text-muted-foreground">{media.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Release Date
                    </div>
                    <div className="font-medium">{media.releaseYear}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Duration
                    </div>
                    <div className="font-medium">{media.duration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Genre
                    </div>
                    <div className="font-medium">
                      {media?.genres?.join(", ")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" /> Director
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Available On</h2>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewList mediaId={media?.id} mediaType={type} />
            </TabsContent>

            <TabsContent value="cast">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <PurchaseOptions price={media.price} rentPrice={2.99} />
        </div>
      </div>

      {/* Related Media */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${type === "MOVIE" ? "movies" : "series"}`}>
              View All
            </Link>
          </Button>
        </div>
        <MediaGrid items={relatedMedia} ratings={ratings} />
      </div>
    </div>
  );
}
