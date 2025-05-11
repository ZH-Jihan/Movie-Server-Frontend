import MediaGrid from "@/components/media-grid";
import PurchaseOptions from "@/components/purchase-options";
import ReviewList from "@/components/review-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Media } from "@/interfaces/media";
import { MediaItem } from "@/interfaces/media-item";
import type { MoviePageProps } from "@/interfaces/page-props";
import { getRelatedMovies } from "@/lib/media-service";
import { getAllMedia, getMediaById } from "@/services/media";
import { Calendar, Clock, Play, Plus, Star, Tag, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MoviePage({ params }: MoviePageProps) {
  const {id} =  await params
  const {data:movie} = await getMediaById(id)
  const {data:relatedMovies} = await getAllMedia({type: movie?.type});
console.log(movie);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <Image
          src="/placeholder.svg"
          alt={movie?.title || "Movie background"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end z-20">
          <div className="container px-4 pb-8 md:pb-12 flex flex-col md:flex-row gap-6">
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
              <Image
                 src={movie?.posterUrl || "/placeholder.svg"}
                alt={movie?.title || "Movie poster"}
                width={256}
                height={384}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">Movie</Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {5.0}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {movie.releaseYear}
                </span>
                <span className="text-sm text-muted-foreground">
                  {movie.duration}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie?.genres?.map((genre : string) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                {movie.description}
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
                  <p className="text-muted-foreground">{movie.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Release Date
                    </div>
                    <div className="font-medium">{movie.releaseYear}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Duration
                    </div>
                    <div className="font-medium">{movie.duration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tag className="h-4 w-4" /> Genre
                    </div>
                    <div className="font-medium">{movie?.genres?.join(", ")}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" /> Director
                    </div>
                    {/* <div className="font-medium">{movie.director}</div> */}
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Available On</h2>
                  {/* <div className="flex flex-wrap gap-3">
                    {movie.streamingPlatforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div> */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewList mediaId={"5"} mediaType="movie" />
            </TabsContent>

            <TabsContent value="cast">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* {movie.cast.map((person) => (
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
          <PurchaseOptions media={movie} />
        </div>
      </div>

      {/* Related Movies */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/movies">View All</Link>
          </Button>
        </div>
        <MediaGrid items={relatedMovies} />
      </div>
    </div>
  );
}
