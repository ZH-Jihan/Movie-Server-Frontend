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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { findRating } from "@/lib/find-rating";
import { getAllMedia } from "@/services/media";
import { Edit, Search, Star, Trash } from "lucide-react";

type Media = {
  search: string;
};

export async function MediaManageTable({ search }: Media) {
  const { data } = await getAllMedia({ search });
  const ratings: { [key: string]: any } = {};
  for (const item of data) {
    ratings[item.id] = await findRating(item.id);
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>Manage your movies and TV series</CardDescription>
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
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
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
  );
}
