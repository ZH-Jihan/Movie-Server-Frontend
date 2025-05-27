"use client";

import FeaturedCarousel from "@/components/featured-carousel";
import MediaGrid from "@/components/media-grid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem } from "@/interfaces/media-item";
import { getAllMedia } from "@/services/media";
import { Search } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
type propr = {
  data: MediaItem[];
  toprated: MediaItem[];
  ratings: Record<string, number>;
};
const HomePage = ({ data, toprated, ratings }: propr) => {
  const [allmedia, setAllMedia] = useState<MediaItem[]>(data || []);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const [topRatedMedia, setTopRatedMedia] = useState<MediaItem[]>(
    toprated || []
  );
  const [newlyAddedMedia, setNewlyAddedMedia] = useState<MediaItem[]>([]);
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem[]>([]);
  const [originalMedia, setOriginalMedia] = useState<MediaItem[]>(data || []);

  // Fetch all media items based on search and genre
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllMedia({ search });
      setAllMedia(data?.data || []);
      setOriginalMedia(data?.data || []);
      if (genre) {
        const filteredData = originalMedia.filter(
          (m) => m.genres && m.genres.includes(genre)
        );
        setAllMedia(filteredData);
      }
    };
    fetchData();
  }, [search, genre]);

  useEffect(() => {
    setNewlyAddedMedia(
      allmedia?.filter(
        (item) =>
          new Date(item.createdAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || []
    );
    setFeaturedMedia(
      allmedia?.filter((item) => item.isPublished === false) || []
    );
  }, [allmedia]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative mb-12">
        <Suspense fallback={<LoadingSpinner size={40} />}>
          <FeaturedCarousel items={data} rating={ratings} />
        </Suspense>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies, series, actors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"].map(
              (genre) => (
                <Badge
                  variant="outline"
                  key={genre}
                  className="cursor-pointer hover:bg-primary 
              hover:text-primary-foreground"
                  onClick={() => setGenre(genre)}
                >
                  {genre}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Tabs defaultValue="all" className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div className="overflow-x-auto">
            <TabsList className="flex flex-nowrap gap-2 min-w-0 w-full">
              <TabsTrigger className="min-w-max" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="min-w-max" value="top-rated">
                Top Rated
              </TabsTrigger>
              <TabsTrigger className="min-w-max" value="newly-added">
                Newly Added
              </TabsTrigger>
              <TabsTrigger className="min-w-max" value="editors-picks">
                Editor's Picks
              </TabsTrigger>
            </TabsList>
          </div>
          {/* <Button
            variant="outline"
            size="sm"
            className="min-w-max w-full md:w-auto"
          >
            View All
          </Button> */}
        </div>

        <TabsContent value="all">
          <Suspense fallback={<LoadingSpinner size={40} />}>
            <MediaGrid items={allmedia} ratings={ratings} />
          </Suspense>
        </TabsContent>

        <TabsContent value="top-rated">
          <Suspense fallback={<LoadingSpinner size={40} />}>
            <MediaGrid
              items={topRatedMedia?.map((item) => ({
                ...item,
                type: item.type.toLowerCase(),
              }))}
              ratings={ratings}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="newly-added">
          <Suspense fallback={<LoadingSpinner size={40} />}>
            <MediaGrid
              items={newlyAddedMedia?.map((item) => ({
                ...item,
                type: item.type.toLowerCase(),
              }))}
              ratings={ratings}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="editors-picks">
          <Suspense fallback={<LoadingSpinner size={40} />}>
            <MediaGrid
              items={featuredMedia?.map((item) => ({
                ...item,
                type: item.type.toLowerCase(),
              }))}
              ratings={ratings}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default HomePage;
