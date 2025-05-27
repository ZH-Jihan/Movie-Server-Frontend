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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface NewsletterData {
  id: string;
  subject: string;
  sentTo: number;
  openRate: number;
  status: string;
  createdAt: string;
}

const columns: ColumnDef<NewsletterData>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "sentTo",
    header: "Recipients",
  },
  {
    accessorKey: "openRate",
    header: "Open Rate",
    cell: ({ row }) => `${row.original.openRate}%`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "SENT"
              ? "success"
              : status === "DRAFT"
              ? "secondary"
              : "destructive"
          }
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    },
  },
];

export default function NewsletterManagement() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletters, setNewsletters] = useState<NewsletterData[]>([]);

  const handleCreateNewsletter = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      subject: formData.get("subject"),
      content: formData.get("content"),
    };

    try {
      // API call to create newsletter
      toast({
        title: "Success",
        description: "Newsletter created successfully",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create newsletter",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Newsletter Management
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Newsletter</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Newsletter</DialogTitle>
              <DialogDescription>
                Create and send a new newsletter to your subscribers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNewsletter}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter newsletter subject"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your newsletter content here..."
                    className="h-64"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Save as Draft
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Newsletter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={newsletters} searchKey="subject" />
    </div>
  );
}
