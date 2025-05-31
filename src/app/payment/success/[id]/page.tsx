"use client";
import { getPurchaseByTransactionId } from "@/services/purchase";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";

interface Purchase {
  id: string;
  type: string;
  price: number;
  status: string;
  transactionId: string;
  createdAt: string;
  media: {
    title: string;
    type: string;
  };
  user: {
    name: string;
    email: string;
  };
}

const PaymentSuccessPage = ({ params }: { params: { id: string } }) => {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const maybePromise = params as unknown;
      if (typeof (maybePromise as any).then === "function") {
        const resolvedParams = await (maybePromise as Promise<{ id: string }>);
        setResolvedId(resolvedParams.id);
      } else {
        setResolvedId((maybePromise as { id: string }).id);
      }
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedId) return;
    const fetchPurchase = async () => {
      try {
        const res = await getPurchaseByTransactionId(resolvedId);
        if (!res.success) throw new Error("Failed to fetch purchase details");
        console.log(res.data);
        setPurchase(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [resolvedId]);

  const downloadInvoice = () => {
    if (!purchase) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(14);
    doc.text(`Invoice ID: ${purchase.id}`, 20, 35);
    doc.text(`Transaction ID: ${purchase.transactionId}`, 20, 45);
    doc.text(`Date: ${new Date(purchase.createdAt).toLocaleString()}`, 20, 55);
    doc.text(`Customer: ${purchase.user.name}`, 20, 65);
    doc.text(`Email: ${purchase.user.email}`, 20, 75);
    doc.text(`Media: ${purchase.media.title} (${purchase.media.type})`, 20, 85);
    doc.text(`Type: ${purchase.type}`, 20, 95);
    doc.text(`Status: ${purchase.status}`, 20, 105);
    doc.text(`Amount Paid: ${purchase.price} BDT`, 20, 115);
    doc.save(`invoice_${purchase.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg font-semibold">
          {error || "Purchase not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <svg
          className="mx-auto mb-4"
          width="64"
          height="64"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="green"
            strokeWidth="2"
            fill="#e6fffa"
          />
          <path
            stroke="green"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12l2 2l4-4"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Thank you for your purchase. Your payment was processed successfully.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 text-left">
          <div>
            <span className="font-semibold">Invoice ID:</span> {purchase.id}
          </div>
          <div>
            <span className="font-semibold">Transaction ID:</span>{" "}
            {purchase.transactionId}
          </div>
          <div>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(purchase.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Media:</span> {purchase.media.title}{" "}
            ({purchase.media.type})
          </div>
          <div>
            <span className="font-semibold">Type:</span> {purchase.type}
          </div>
          <div>
            <span className="font-semibold">Amount Paid:</span> {purchase.price}{" "}
            BDT
          </div>
        </div>
        <button
          onClick={downloadInvoice}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
