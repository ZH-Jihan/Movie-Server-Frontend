"use client";
import { useAuth } from "@/lib/use-auth";
import { getUserPurchases } from "@/services/purchase";
import { useEffect, useState } from "react";

const PurchasesPage = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserPurchases(user.id).then((res) => setPurchases(res.data));
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <ul className="space-y-2">
          {purchases.map((purchase) => (
            <li key={purchase.id} className="border p-4 rounded">
              <div className="font-semibold">{purchase.media?.title}</div>
              <div>Type: {purchase.type}</div>
              <div>Status: {purchase.status}</div>
              <div>Price: ${purchase.price}</div>
              <div>Date: {new Date(purchase.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PurchasesPage;
