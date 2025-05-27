"use client";

import { useAuth } from "@/lib/use-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Minimal interfaces for demonstration
interface Movie {
  title: string;
  posterUrl?: string;
}
interface Comment {
  movieTitle: string;
  text: string;
  moviePosterUrl?: string;
}
interface Review {
  movieTitle: string;
  text: string;
  moviePosterUrl?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (user === null) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  // Placeholder data structure for demonstration
  const reviews: Review[] = [];
  const comments: Comment[] = [];
  const likedMovies: Movie[] = [];
  const watchlist: Movie[] = [];
  const purchasedMovies: Movie[] = [];

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* User Card */}
        <div className="bg-zinc-900 rounded-xl shadow-lg p-8 flex items-center gap-6 mb-10 border border-zinc-800">
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl font-bold text-zinc-400 border-4 border-zinc-800 shadow">
                {user.name?.[0] || "U"}
              </div>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {user.name}
            </div>
            <div className="text-zinc-400 mb-1">{user.email}</div>
            <div className="text-sm text-zinc-500 mt-1">
              Role:{" "}
              <span className="font-medium">
                {user.isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid gap-8">
          <SectionCard<Movie>
            title="Liked Movies"
            items={likedMovies}
            emptyMsg="No liked movies yet."
            renderItem={(movie) => <MovieListItem movie={movie} />}
          />
          <SectionCard<Comment>
            title="Commented Movies"
            items={comments}
            emptyMsg="No comments yet."
            renderItem={(comment) => (
              <MovieListItem
                movie={{
                  title: comment.movieTitle,
                  posterUrl: comment.moviePosterUrl,
                }}
                subtitle={comment.text}
              />
            )}
          />
          <SectionCard<Movie>
            title="Watchlist"
            items={watchlist}
            emptyMsg="No movies in watchlist."
            renderItem={(movie) => <MovieListItem movie={movie} />}
          />
          <SectionCard<Movie>
            title="Purchased Movies"
            items={purchasedMovies}
            emptyMsg="No purchased movies."
            renderItem={(movie) => <MovieListItem movie={movie} />}
          />
          <SectionCard<Review>
            title="Reviews"
            items={reviews}
            emptyMsg="No reviews yet."
            renderItem={(review) => (
              <MovieListItem
                movie={{
                  title: review.movieTitle,
                  posterUrl: review.moviePosterUrl,
                }}
                subtitle={review.text}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

interface SectionCardProps<T> {
  title: string;
  items: T[];
  emptyMsg: string;
  renderItem: (item: T) => React.ReactNode;
}

function SectionCard<T>({
  title,
  items,
  emptyMsg,
  renderItem,
}: SectionCardProps<T>) {
  return (
    <div className="bg-zinc-900 rounded-lg shadow p-6 border border-zinc-800">
      <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-800 pb-2">
        {title}
      </h2>
      {items.length === 0 ? (
        <div className="text-zinc-500 italic text-sm">{emptyMsg}</div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Movie list item with thumbnail and optional subtitle
function MovieListItem({
  movie,
  subtitle,
}: {
  movie: Movie;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800 transition group cursor-pointer">
      <Image
        src={movie.posterUrl || "/placeholder.svg?height=80&width=56"}
        alt={movie.title}
        width={56}
        height={80}
        className="w-14 h-20 object-cover rounded shadow border border-zinc-700 bg-zinc-800 group-hover:scale-105 transition"
      />
      <div>
        <div className="text-base font-medium text-zinc-200 group-hover:text-white transition">
          {movie.title}
        </div>
        {subtitle && (
          <div className="text-sm text-zinc-400 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
