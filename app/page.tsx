import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import FeaturedCarousel from "@/components/featured-carousel"
import MediaGrid from "@/components/media-grid"
import { getFeaturedMedia, getTopRatedMedia, getNewlyAddedMedia } from "@/lib/media-service"

export default async function Home() {
  const featuredMedia = await getFeaturedMedia()
  const topRatedMedia = await getTopRatedMedia()
  const newlyAddedMedia = await getNewlyAddedMedia()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative mb-12">
        <FeaturedCarousel items={featuredMedia} />

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search movies, series, actors..." className="pl-10 py-6 text-lg" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Action
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Comedy
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Drama
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Netflix
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Disney+
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <Tabs defaultValue="top-rated" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="newly-added">Newly Added</TabsTrigger>
            <TabsTrigger value="editors-picks">Editor's Picks</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <TabsContent value="top-rated">
          <MediaGrid items={topRatedMedia} />
        </TabsContent>

        <TabsContent value="newly-added">
          <MediaGrid items={newlyAddedMedia} />
        </TabsContent>

        <TabsContent value="editors-picks">
          <MediaGrid items={featuredMedia} />
        </TabsContent>
      </Tabs>

      {/* Genres Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            "Action",
            "Comedy",
            "Drama",
            "Horror",
            "Sci-Fi",
            "Romance",
            "Thriller",
            "Animation",
            "Documentary",
            "Fantasy",
          ].map((genre) => (
            <Card key={genre} className="overflow-hidden group cursor-pointer">
              <CardContent className="p-0 relative h-32 flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/40">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                <h3 className="text-xl font-bold text-white z-10">{genre}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Streaming Platforms */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Streaming Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["Netflix", "Disney+", "Amazon Prime", "HBO Max"].map((platform) => (
            <Card key={platform} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-center h-24">
                <h3 className="text-xl font-medium">{platform}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
