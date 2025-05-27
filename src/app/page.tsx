import HomePage from "@/components/media/HomePage";
import { Card, CardContent } from "@/components/ui/card";
import { findRating } from "@/lib/find-rating";
import { getAllMedia, getTopRated } from "@/services/media";

export const revalidate = 3600;

export default async function Home() {
  const { data } = await getAllMedia({});
  const { data: toprated } = await getTopRated();

  // Fetch ratings for all items
  const ratings: { [key: string]: any } = {};
  for (const item of data) {
    ratings[item.id] = await findRating(item.id);
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with all movie*/}
      <HomePage data={data} toprated={toprated} ratings={ratings} />
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
    </div>
  );
}
