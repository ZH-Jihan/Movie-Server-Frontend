"use client";

import MediaGrid from "@/components/media-grid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { MediaItem } from "@/interfaces/media-item";
import { getAllMedia } from "@/services/media";
import { useEffect, useState } from "react";

const GENRES = [
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
];

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");
  const [filtered, setFiltered] = useState<MediaItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);


useEffect(() => {
  const fetchData = async () => {
    const data = await getAllMedia({ search ,type: "MOVIE" });
    console.log(data);
    setAllMovies(data?.data);
  };
  fetchData();
}, [search]);
 

  useEffect(() => {
    let movies = allMovies;
    if (genre) {
      movies = movies.filter((m) => m.genres && m.genres.includes(genre));
    }
    if (year) {
      movies = movies.filter((m) => String(m.releaseYear) === year);
    }
    // if (minRating) {
    //   movies = movies.filter((m) => m. >= Number(minRating));
    // }
    setFiltered(movies);
  }, [search, genre, year, allMovies]);

  function resetFilters() {
    setSearch("");
    setGenre("");
    setYear("");
    setMinRating("");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Movies</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Badge
              key={g}
              variant={genre === g ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setGenre(genre === g ? "" : g)}
            >
              {g}
            </Badge>
          ))}
        </div>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Any Rating</option>
          {ratings.map((r) => (
            <option key={r} value={r}>
              {r}+
            </option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
        >
          Reset Filters
        </button>
      </div>
      <MediaGrid items={filtered} />
    </div>
  );
}
