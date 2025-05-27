"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface OverviewProps {
  stats: {
    totalRevenue: number;
    totalUsers: number;
    totalPurchases: number;
    activeSubscriptions: number;
  };
}

export default function Overview({ stats }: OverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        description="Total revenue from all purchases"
        icon={DollarSign}
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        description="Total registered users"
        icon={Users}
      />
      <StatCard
        title="Total Purchases"
        value={stats.totalPurchases.toLocaleString()}
        description="Total movies and series purchased"
        icon={ShoppingCart}
      />
      <StatCard
        title="Active Subscriptions"
        value={stats.activeSubscriptions.toLocaleString()}
        description="Currently active subscriptions"
        icon={BarChart3}
      />
    </div>
  );
}
