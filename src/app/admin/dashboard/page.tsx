"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart-components";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem } from "@/interfaces/media-item";
import { TPandingReview } from "@/interfaces/review";
import { getAllMedia } from "@/services/media";
import { getAllReviews } from "@/services/review";
import {
  CheckCircle,
  DollarSign,
  Edit,
  Film,
  Search,
  Star,
  Trash,
  Tv,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<TPandingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const ratings: { [key: string]: number } = {};

  useEffect(() => {
    async function fetchData() {
      try {
        const [mediaData, reviewData] = await Promise.all([
          getAllMedia({}),
          getAllReviews(),
        ]);

        setMedia(
          mediaData.data.map((item) => ({
            ...item,
            type: item.type === "MOVIE" ? "movie" : "series",
            purchaseOptions: {
              rent: {
                price: item.purchaseOptions?.rent?.price || 0,
                duration: item.purchaseOptions?.rent?.duration || "N/A",
              },
              buy: {
                price: item.purchaseOptions?.buy?.price || 0,
              },
            },
          }))
        );

        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log("Reviews:", reviews);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Mock data for charts
  const salesData = [
    {
      name: "Jan",
      total: 0,
    },
    {
      name: "Feb",
      total: 10,
    },
    {
      name: "Mar",
      total: 15,
    },
    {
      name: "Apr",
      total: 0,
    },
    {
      name: "May",
      total: 7,
    },
    {
      name: "Jun",
      total: 30,
    },
  ];

  const userActivityData = [
    {
      name: "Reviews",
      value: 420,
    },
    {
      name: "Ratings",
      value: 980,
    },
    {
      name: "Comments",
      value: 350,
    },
    {
      name: "Purchases",
      value: 520,
    },
  ];

  // Mock data for pending reviews
  const pendingReviews = [
    {
      id: "review1",
      user: "John Doe",
      title: "Inception",
      rating: 9,
      content:
        "This movie blew my mind with its complex storyline and amazing visuals.",
      date: "2023-05-15",
    },
    {
      id: "review2",
      user: "Jane Smith",
      title: "The Dark Knight",
      rating: 10,
      content:
        "Heath Ledger's performance as the Joker was absolutely incredible.",
      date: "2023-05-14",
    },
    {
      id: "review3",
      user: "Mike Johnson",
      title: "Interstellar",
      rating: 8,
      content:
        "The science was fascinating, but some parts were a bit confusing.",
      date: "2023-05-13",
    },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Movies
              </p>
              <h3 className="text-2xl font-bold">
                {media.filter((i) => i.type === "movie").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Tv className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Series
              </p>
              <h3 className="text-2xl font-bold">
                {media.filter((i) => i.type === "series").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h3 className="text-2xl font-bold">8,521</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <h3 className="text-2xl font-bold">$42,582</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Monthly sales data for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={salesData}
              categories={["total"]}
              index="name"
              colors={["#0ea5e9"]}
              valueFormatter={(value) => `$${value}`}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Breakdown of user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={userActivityData}
              categories={["value"]}
              index="name"
              colors={["#0ea5e9"]}
              valueFormatter={(value) => `${value}`}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="media-library">
        <TabsList className="mb-4 flex-wrap overflow-x-auto">
          <TabsTrigger
            value="media-library"
            className="whitespace-nowrap min-w-[120px]"
          >
            Media Library
          </TabsTrigger>
          <TabsTrigger
            value="pending-reviews"
            className="whitespace-nowrap min-w-[120px]"
          >
            Pending Reviews
          </TabsTrigger>
          <TabsTrigger
            value="user-management"
            className="whitespace-nowrap min-w-[120px]"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger
            value="sales-reports"
            className="whitespace-nowrap min-w-[120px]"
          >
            Sales Reports
          </TabsTrigger>
        </TabsList>

        {/* Media Library Tab */}
        <TabsContent value="media-library">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage your movies and TV series
              </CardDescription>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search titles..."
                    className="pl-10 w-full"
                    value={search}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px] text-xs sm:text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Rentals</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {media.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.releaseYear}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                            <span>{ratings[item.id]}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{"N/A"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Reviews Tab */}
        <TabsContent value="pending-reviews">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Reviews awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{review.media.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {review.user.name} on {review.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="font-medium">{review.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{review.text}</p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                      <Button size="sm" className="gap-1">
                        <CheckCircle className="h-4 w-4" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User management content would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales-reports">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>
                View detailed sales and revenue reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sales reports content would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
