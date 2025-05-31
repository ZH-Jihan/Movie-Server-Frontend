import MediaGrid from "@/components/media-grid";
import FilterBarSkeleton from "@/components/ui/FilterBarSkeleton";
import MediaGridSkeleton from "@/components/ui/MediaGridSkeleton";
import type { MediaItem } from "@/interfaces/media-item";
import { findRating } from "@/lib/find-rating";
import { getAllMedia } from "@/services/media";
import { useEffect, useState } from "react";

const GENRES = [
  "Action",
  "Sci-Fi",
  "Thriller",
  "Anime",
  "Horror",
  "Adventure",
  "Comedy",
  "Family",
  "Drama",
  "Romance",
  "History",
];

const ITEMS_PER_PAGE = 20;

interface CommonMediaLayoutProps {
  type: "MOVIE" | "SERIES";
}

export default function CommonMediaLayout({ type }: CommonMediaLayoutProps) {
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [filtered, setFiltered] = useState<MediaItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch all media items based on search and type
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllMedia({ search, limit: 10 });
      setAllMedia(data?.data || []);
      const uniqueYears = Array.from(
        new Set((data?.data || []).map((m: MediaItem) => m.releaseYear))
      ).sort((a, b) => b - a);
      setYears(uniqueYears);
      setLoading(false);
    };
    fetchData();
  }, [search, type]);

  // Filter media based on search, genre, and year
  useEffect(() => {
    let media = allMedia;
    if (genre) {
      media = media.filter((m) => m.genres && m.genres.includes(genre));
    }
    if (year) {
      media = media.filter((m) => String(m.releaseYear) === year);
    }
    setFiltered(media);
  }, [search, genre, year, allMedia]);

  // Fetch ratings for all media items
  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsMap: Record<string, number> = {};
      for (const item of allMedia) {
        ratingsMap[item.id] = await findRating(item.id);
      }
      setRatings(ratingsMap);
    };
    fetchRatings();
  }, [allMedia]);

  // Reset page to 1 when filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, genre, year, allMedia]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // main content
  return (
    <div className="min-h-screen bg-[#0b0c23] text-white">
      <div className=" mx-auto container flex px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-56 hidden md:block">
          <div className="mb-8">
            <div className="text-2xl font-bold mb-6">Genres</div>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  className={`text-lg font-semibold transition-colors ${
                    !genre
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-300"
                  }`}
                  onClick={() => setGenre("")}
                >
                  All
                </button>
              </li>
              {GENRES.map((g) => (
                <li key={g}>
                  <button
                    className={`text-lg transition-colors ${
                      genre === g
                        ? "text-purple-400 font-semibold"
                        : "text-gray-300 hover:text-purple-300"
                    }`}
                    onClick={() => setGenre(genre === g ? "" : g)}
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-300 mb-4">
            Home / Movies /{" "}
            <span className="text-white font-semibold">All</span>
          </div>
          {/* Filter Bar */}
          {loading ? (
            <FilterBarSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 mb-8 items-center">
              <select
                value={genre || "All"}
                onChange={(e) =>
                  setGenre(e.target.value === "All" ? "" : e.target.value)
                }
                className="bg-[#18193a] text-white rounded-xl px-6 py-2 focus:outline-none border-none shadow-sm"
              >
                <option value="All">All</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                value={year || "All"}
                onChange={(e) =>
                  setYear(e.target.value === "All" ? "" : e.target.value)
                }
                className="bg-[#18193a] text-white rounded-xl px-6 py-2 focus:outline-none border-none shadow-sm"
              >
                <option value="All">All</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                className="bg-[#18193a] text-white rounded-xl px-6 py-2 focus:outline-none border-none shadow-sm"
                defaultValue="Latest"
                disabled
              >
                <option>Latest</option>
              </select>
              <select
                className="bg-[#18193a] text-white rounded-xl px-6 py-2 focus:outline-none border-none shadow-sm"
                defaultValue="Title"
                disabled
              >
                <option>Title</option>
              </select>
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="col-span-2 md:col-span-1 bg-[#18193a] text-gray-300 rounded-xl px-6 py-2 w-full md:w-72 focus:outline-none border-none shadow-sm placeholder:text-gray-400"
              />
              <span className="text-gray-400 col-span-2 md:ml-auto text-base">
                {filtered.length} results
              </span>
            </div>
          )}
          {/* Movie Grid */}
          {loading ? (
            <MediaGridSkeleton />
          ) : (
            <MediaGrid items={paginatedItems} ratings={ratings} />
          )}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded bg-[#18193a] text-white disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-purple-500 text-white font-bold"
                      : "bg-[#18193a] text-white hover:bg-purple-700"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-[#18193a] text-white disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
          {/* No results message */}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 mt-16 text-lg">
              No movies found.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
