"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWatchlist } from "@/services/media";
import { getUserReviews } from "@/services/review";
import { ColumnDef } from "@tanstack/react-table";
import { Film, ListChecks, Star, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Recent activity table columns
interface ActivityData {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
}

const columns: ColumnDef<ActivityData>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge variant="secondary">{type}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "Completed"
              ? "success"
              : status === "In Progress"
              ? "warning"
              : "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

// Mock data
const mockData = {
  stats: {
    watchedMovies: 15,
    watchlist: 8,
    reviews: 12,
    watchTime: 45,
  },
  watchHistory: [
    { name: "Week 1", movies: 4 },
    { name: "Week 2", movies: 3 },
    { name: "Week 3", movies: 5 },
    { name: "Week 4", movies: 3 },
  ],
  recentActivity: [
    {
      id: "1",
      title: "The Dark Knight",
      type: "Watch",
      status: "Completed",
      date: "2025-05-26",
    },
    {
      id: "2",
      title: "Inception",
      type: "Review",
      status: "Completed",
      date: "2025-05-25",
    },
    {
      id: "3",
      title: "The Matrix",
      type: "Watchlist",
      status: "Added",
      date: "2025-05-24",
    },
  ],
};

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [activity] = useState<ActivityData[]>(mockData.recentActivity);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await getWatchlist();
        const reviews = await getUserReviews();
        setReviews(reviews);
        setWatchlist(response.data || []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setWatchlist([]);
      }
    };
    fetchWatchlist();
  }, []);
  console.log(watchlist);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Movies Watched"
          value={0}
          description="Total movies watched"
          icon={<Film className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Watchlist"
          value={watchlist?.length}
          description="Movies to watch"
          icon={<ListChecks className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Reviews"
          value={reviews?.length}
          description="Reviews written"
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Watch Time"
          value={`${0}h`}
          description="Total hours watched"
          icon={<Timer className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Watch History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.watchHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="movies"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/history">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={activity} searchKey="title" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
