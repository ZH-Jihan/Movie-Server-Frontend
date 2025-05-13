import MediaGrid from "@/components/media-grid";
import PurchaseOptions from "@/components/purchase-options";
import ReviewList from "@/components/review-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SeriesPageProps } from "@/interfaces/page-props";
import { getMovieById, getRelatedMovies } from "@/lib/media-service"; // Replace with getSeriesById, getRelatedSeries if available
import { getAllMedia, getMediaById } from "@/services/media";
import { Calendar, Clock, Play, Plus, Star, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function SeriesPage({ params }: SeriesPageProps) {
  // Replace getMovieById with getSeriesById if you have it
const {id} =  await params
  const {data} = await getMediaById(id)
  const series = data.media
  const {data:relatedSeries} = series.type ? await getAllMedia({type: series?.type}): {data: []};

  if (!series) {
    return <div>Series not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <Image
          src={"/placeholder.svg"}
          alt={series.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end z-20">
          <div className="container px-4 pb-8 md:pb-12 flex flex-col md:flex-row gap-6">
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src={series.posterUrl || "/placeholder.svg"}
                alt={series.title}
                width={256}
                height={384}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">TV</Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {data.avgRating || 5.0}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {series.releaseYear}
                </span>
                <span className="text-sm text-muted-foreground">
                  {series.duration}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {series.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {series.genres.map((genre: string) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                {series.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" /> Watch Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Add to Watchlist
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
                  <p className="text-muted-foreground">{series.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Release Date
                    </div>
                    <div className="font-medium">{series.releaseYear}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Duration
                    </div>
                    <div className="font-medium">{series.duration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Genre
                    </div>
                    <div className="font-medium">
                      {series.genres.join(", ")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" /> Director
                    </div>
                    {/* <div className="font-medium">{series.director}</div> */}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Available On</h2>
                  <div className="flex flex-wrap gap-3">
                    {/* {series.streamingPlatforms.map((platform: string) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))} */}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewList mediaId={params.id} mediaType="series" />
            </TabsContent>

            <TabsContent value="cast">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* {series.cast.map((person: any) => (
                  <div key={person.id} className="text-center">
                    <div className="aspect-square rounded-full overflow-hidden mb-2 mx-auto w-24 h-24">
                      <Image
                        src={person.imageUrl || "/placeholder.svg"}
                        alt={person.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {person.character}
                    </p>
                  </div>
                ))} */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <PurchaseOptions media={series} />
        </div>
      </div>

      {/* Related Series */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/series">View All</Link>
          </Button>
        </div>
        <MediaGrid items={relatedSeries} />
      </div>
    </div>
  );
}
