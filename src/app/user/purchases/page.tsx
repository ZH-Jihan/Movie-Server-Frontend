"use client";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const totalPages = Math.ceil(purchases.length / ITEMS_PER_PAGE);
  const paginated = purchases.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#18181b] border border-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Title
                </th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Type
                </th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Status
                </th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Price
                </th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Date
                </th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-200 font-semibold bg-[#23232a]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-[#23232a] transition">
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
                    {purchase.media?.title || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
                    {purchase.type || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
                    {purchase.status || "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
                    ${purchase.price}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
                    {new Date(purchase.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">
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

export default PurchasesPage;
