type FetcherOptions = RequestInit & {
  onJwtExpired?: () => void;
};

export async function apiFetch<T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  // Only set Content-Type for JSON, not FormData
  if (
    options.body &&
    typeof options.body === "string" &&
    !(options.headers && (options.headers as any)["Content-Type"])
  ) {
    options.headers = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    };
  }
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    if (data?.message === "jwt expired" && options.onJwtExpired) {
      options.onJwtExpired();
    }
    throw new Error(data?.message || "API error");
  }
  return data;
}
