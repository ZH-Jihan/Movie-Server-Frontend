"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createCoupon, getAllCoupons } from "@/services/coupon";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export interface CouponData {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  status: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<CouponData>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "discount",
    header: "Discount (%)",
  },
  {
    accessorKey: "maxUses",
    header: "Max Uses",
  },
  {
    accessorKey: "usedCount",
    header: "Used",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "ACTIVE"
              ? "success"
              : status === "EXPIRED"
              ? "destructive"
              : "secondary"
          }
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => {
      const date = new Date(row.original.expiresAt);
      return date.toLocaleDateString();
    },
  },
];

export default function CouponManagement() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<CouponData[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await getAllCoupons();
        console.log("Fetched Coupons:", res);

        if (res.data) {
          setCoupons(res.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: `Error ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          description: "Failed to fetch coupons",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code"),
      discount: Number(formData.get("discount")),
      maxUses: Number(formData.get("maxUses")),
      expiresAt: new Date(formData.get("expiresAt") as string).toISOString(),
    };

    try {
      // API call to create coupon
      const res = await createCoupon(data);
      if (res.status && res.data) {
        // Update local state with the new coupon
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
        setOpen(false);
        e.currentTarget.reset(); // Reset the form
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        description: "Failed to create coupon",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Coupon Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a new discount coupon for your customers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCoupon}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., SUMMER2025"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g., 20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    min="1"
                    placeholder="e.g., 100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiry Date</Label>
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={coupons} searchKey="code" />
    </div>
  );
}
