"use client";

import type { MediaItem } from "@/components/media-grid";
import MediaGrid from "@/components/media-grid";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getTopRatedMedia } from "@/lib/media-service";
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

export default function SeriesPage() {
  const [allSeries, setAllSeries] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");
  const [filtered, setFiltered] = useState<MediaItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);

  useEffect(() => {
    getTopRatedMedia().then((data) => {
      const series = data.filter((item) => item.type === "series");
      setAllSeries(series);
      setFiltered(series);
      setYears([...new Set(series.map((s) => s.year))].sort((a, b) => b - a));
      setRatings(
        [...new Set(series.map((s) => Math.floor(s.rating)))].sort(
          (a, b) => b - a
        )
      );
    });
  }, []);

  useEffect(() => {
    let series = allSeries;
    if (search) {
      series = series.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genre) {
      series = series.filter((s) => s.genres && s.genres.includes(genre));
    }
    if (year) {
      series = series.filter((s) => String(s.year) === year);
    }
    if (minRating) {
      series = series.filter((s) => s.rating >= Number(minRating));
    }
    setFiltered(series);
  }, [search, genre, year, minRating, allSeries]);

  function resetFilters() {
    setSearch("");
    setGenre("");
    setYear("");
    setMinRating("");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Series</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Search series..."
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
