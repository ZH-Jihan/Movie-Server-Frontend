"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { MovieFormState } from "@/interfaces/movie-form";
import { useAuth } from "@/lib/use-auth";
import { uploadMedia } from "@/services/media";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const GENRES = [
  "Action",
  "Drama",
  "Comedy",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Horror",
  "Fantasy",
  "Documentary",
  "Animation",
];
const MEDIA_TYPES = [
  { label: "Movie", value: "MOVIE" },
  { label: "Series", value: "SERIES" },
];

export default function MoviePostPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [form, setForm] = useState<MovieFormState>({
    title: "",
    description: "",
    type: "movie",
    genres: [],
    releaseYear: new Date().getFullYear(),
    duration: 120,
    price: 9.99,
    rentPrice: 3.99,
    streamingLink: "",
    drmProtected: false,
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if ( !isAdmin) {
    router.push("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenreChange = (genre: string) => {
    setForm((prev) => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres };
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      type: e.target.value as "movie" | "series",
    }));
  };

  async function uploadImage(file: File): Promise<string> {
    // Simulate upload delay
    await new Promise((res) => setTimeout(res, 1000));
    // Return a fake URL (replace with real upload logic)
    return URL.createObjectURL(file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const fromdata = new FormData();
      let uploadedImageUrl = imageUrl;
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
        setImageUrl(uploadedImageUrl);
      }

      fromdata.append("file", imageFile as Blob);

      const movieData = {
        ...form,
        releaseYear: Number(form.releaseYear),
        duration: Number(form.duration),
        price: Number(form.price),
        rentPrice: Number(form.rentPrice),
      };

      fromdata.append("data", JSON.stringify(movieData));
      const res = await uploadMedia(fromdata)
      console.log(res);
      if (!res?.success) {
        throw new Error(res?.message || "Failed to create media");
      }
      setSuccess("Movie posted successfully!");
      setForm({
        title: "",
        description: "",
        type: "movie",
        genres: [],
        releaseYear: new Date().getFullYear(),
        duration: 120,
        price: 9.99,
        rentPrice: 3.99,
        streamingLink: "",
        drmProtected: false,
        isPublished: false,
      });
      setImageFile(null);
      setImageUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin")}
        >
          &larr; Back
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Post a New Movie/Series
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label
              htmlFor="title"
              className="text-base font-medium text-foreground"
            >
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full"
              size={32}
            />
          </div>
          <div>
            <Label
              htmlFor="type"
              className="text-base font-medium text-foreground"
            >
              Type
            </Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleTypeChange}
              className="w-full border rounded px-3 py-2 mt-1 bg-background"
            >
              {MEDIA_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label
            htmlFor="description"
            className="text-base font-medium text-foreground"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="mt-1 min-h-[80px] w-full"
          />
        </div>
        {/* Genres */}
        <div>
          <Label className="text-base font-medium text-foreground mb-2 block">
            Genres
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GENRES.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="accent-primary rounded border-gray-300"
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label
              htmlFor="releaseYear"
              className="text-base font-medium text-foreground"
            >
              Release Year
            </Label>
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              value={form.releaseYear}
              onChange={handleChange}
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="duration"
              className="text-base font-medium text-foreground"
            >
              Duration (min/episodes)
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              required
              className="mt-1 w-full"
            />
          </div>
        </div>
        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label
              htmlFor="price"
              className="text-base font-medium text-foreground"
            >
              Purchase Price
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="rentPrice"
              className="text-base font-medium text-foreground"
            >
              Rent Price
            </Label>
            <Input
              id="rentPrice"
              name="rentPrice"
              type="number"
              step="0.01"
              value={form.rentPrice}
              onChange={handleChange}
              required
              className="mt-1 w-full"
            />
          </div>
        </div>
        {/* Streaming */}
        <div>
          <Label
            htmlFor="streamingLink"
            className="text-base font-medium text-foreground"
          >
            Streaming Link
          </Label>
          <Input
            id="streamingLink"
            name="streamingLink"
            value={form.streamingLink}
            onChange={handleChange}
            required
            className="mt-1 w-full"
          />
        </div>
        {/* Image Upload */}
        <div>
          <Label
            htmlFor="image"
            className="text-base font-medium text-foreground"
          >
            Poster Image
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept={"image/*"}
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
                setImageUrl("");
              }
            }}
            className="mt-1 w-full"
          />
          {imageFile && (
            <div className="mt-2 flex items-center gap-4">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-h-40 rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImageUrl("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          )}
          {imageUrl && !imageFile && (
            <div className="mt-2 flex items-center gap-4">
              <img src={imageUrl} alt="Preview" className="max-h-40 rounded" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="drmProtected"
              className="text-base font-medium text-foreground"
            >
              DRM Protected
            </Label>
            <Switch
              id="drmProtected"
              checked={form.drmProtected}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, drmProtected: checked }))
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="isPublished"
              className="text-base font-medium text-foreground"
            >
              Published
            </Label>
            <Switch
              id="isPublished"
              checked={form.isPublished}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isPublished: checked }))
              }
            />
          </div>
        </div>
        {error && <div className="text-red-500 font-medium">{error}</div>}
        {success && <div className="text-green-600 font-medium">{success}</div>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto py-3 text-base font-semibold"
        >
          {loading ? "Posting..." : "Post Movie"}
        </Button>
      </form>
    </div>
  );
}
