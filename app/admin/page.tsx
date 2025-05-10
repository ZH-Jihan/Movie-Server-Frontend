"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Film, Tv, Users, DollarSign, Star, CheckCircle, XCircle, Edit, Trash, Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MoviePostPage from "./movie-post"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not admin
  if (!user || !isAdmin) {
    router.push("/login")
    return null
  }

  // Mock data for charts
  const salesData = [
    {
      name: "Jan",
      total: 1200,
    },
    {
      name: "Feb",
      total: 1800,
    },
    {
      name: "Mar",
      total: 2200,
    },
    {
      name: "Apr",
      total: 2600,
    },
    {
      name: "May",
      total: 3200,
    },
    {
      name: "Jun",
      total: 3800,
    },
  ]

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
  ]

  // Mock data for pending reviews
  const pendingReviews = [
    {
      id: "review1",
      user: "John Doe",
      title: "Inception",
      rating: 9,
      content: "This movie blew my mind with its complex storyline and amazing visuals.",
      date: "2023-05-15",
    },
    {
      id: "review2",
      user: "Jane Smith",
      title: "The Dark Knight",
      rating: 10,
      content: "Heath Ledger's performance as the Joker was absolutely incredible.",
      date: "2023-05-14",
    },
    {
      id: "review3",
      user: "Mike Johnson",
      title: "Interstellar",
      rating: 8,
      content: "The science was fascinating, but some parts were a bit confusing.",
      date: "2023-05-13",
    },
  ]

  // Mock data for media library
  const mediaLibrary = [
    {
      id: "movie1",
      title: "Inception",
      type: "Movie",
      year: 2010,
      rating: 8.8,
      purchases: 245,
      rentals: 520,
    },
    {
      id: "series1",
      title: "Breaking Bad",
      type: "TV Series",
      year: 2008,
      rating: 9.5,
      purchases: 320,
      rentals: 680,
    },
    {
      id: "movie2",
      title: "The Dark Knight",
      type: "Movie",
      year: 2008,
      rating: 9.0,
      purchases: 310,
      rentals: 590,
    },
    {
      id: "series2",
      title: "Game of Thrones",
      type: "TV Series",
      year: 2011,
      rating: 9.2,
      purchases: 420,
      rentals: 780,
    },
    {
      id: "movie3",
      title: "Pulp Fiction",
      type: "Movie",
      year: 1994,
      rating: 8.9,
      purchases: 280,
      rentals: 450,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Title
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Post a New Movie/Series</DialogTitle>
            </DialogHeader>
            <MoviePostPage />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Movies</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Tv className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Series</p>
              <h3 className="text-2xl font-bold">342</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
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
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <h3 className="text-2xl font-bold">$42,582</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales data for the past 6 months</CardDescription>
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
        <TabsList className="mb-6">
          <TabsTrigger value="media-library">Media Library</TabsTrigger>
          <TabsTrigger value="pending-reviews">Pending Reviews</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="sales-reports">Sales Reports</TabsTrigger>
        </TabsList>

        {/* Media Library Tab */}
        <TabsContent value="media-library">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Manage your movies and TV series</CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search titles..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
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
                  {mediaLibrary.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                          <span>{item.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.purchases}</TableCell>
                      <TableCell>{item.rentals}</TableCell>
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
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{review.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {review.user} on {review.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="font-medium">{review.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-sm mb-4">{review.content}</p>
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
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management content would go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales-reports">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>View detailed sales and revenue reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sales reports content would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
