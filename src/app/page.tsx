import HomePage from "@/components/media/HomePage";
import NewsletterSection from "@/components/media/NewsletterSection";
import { Card, CardContent } from "@/components/ui/card";
import { findRating } from "@/lib/find-rating";
import { getAllMedia, getTopRated } from "@/services/media";

export const revalidate = 3600;

export default async function Home() {
  const { data } = await getAllMedia({ limit: 1000 });

  // Fetch ratings for all items
  const ratings: { [key: string]: any } = {};
  for (const item of data) {
    ratings[item?.id] = await findRating(item?.id);
  }

  // Fetch top rated movies
  const { data: toprated } = await getTopRated();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with all movie*/}
      <HomePage ratings={ratings} />
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
            <Card
              key={platform}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 flex items-center justify-center h-24">
                <h3 className="text-xl font-medium">{platform}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Top Rated Movies Section */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">Top Rated Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for top rated movies */}
          {toprated.slice(0, 4).map((movie: any) => {
            let ratingValue = ratings[movie.id];
            if (typeof ratingValue === "string") {
              ratingValue = parseFloat(ratingValue);
            }
            const displayRating =
              typeof ratingValue === "number" && !isNaN(ratingValue)
                ? ratingValue.toFixed(1)
                : "N/A";
            return (
              <Card key={movie.id} className="overflow-hidden cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Rating: {displayRating}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for user reviews */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <p className="italic">
                "Amazing platform! I found all my favorite movies here."
              </p>
              <span className="block mt-2 text-sm font-medium">- User123</span>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <p className="italic">"Great recommendations and easy to use."</p>
              <span className="block mt-2 text-sm font-medium">
                - MovieBuff
              </span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for featured creators */}
          <Card className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 mb-2" />
              <h3 className="text-lg font-semibold mb-1">Jane Doe</h3>
              <p className="text-sm text-muted-foreground">Director</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 mb-2" />
              <h3 className="text-lg font-semibold mb-1">John Smith</h3>
              <p className="text-sm text-muted-foreground">Actor</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Comments Section */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">Latest Comments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for latest comments */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <p className="italic">
                "Loved the plot twist in the last episode!"
              </p>
              <span className="block mt-2 text-sm font-medium">
                - SeriesFan
              </span>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <p className="italic">"The cinematography was stunning."</p>
              <span className="block mt-2 text-sm font-medium">
                - MovieLover
              </span>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
