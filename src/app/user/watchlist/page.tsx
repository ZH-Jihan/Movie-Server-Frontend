"use client";
import { getWatchlist } from "@/services/media";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await getWatchlist();
        console.log(res);
        if (res.success) {
          setWatchlist(res.data || []);
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE);
  const paginated = watchlist.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      {loading ? (
        <div>Loading...</div>
      ) : watchlist.length === 0 ? (
        <p>No items in your watchlist.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">
                    {item.media?.title || "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.media?.type || "-"}
                  </td>
                  <td className="px-4 py-2 border">{item.status || "-"}</td>
                  <td className="px-4 py-2 border">
                    {/* Add actions if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
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
                      : "bg-gray-200 text-gray-700 hover:bg-purple-700 hover:text-white"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
