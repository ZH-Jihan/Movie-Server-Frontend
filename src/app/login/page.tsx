"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Film } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleDemoUser = () => {
    form.setValue("email", "demo@gmail.com");
    form.setValue("password", "demo123");
  };

  const handleDemoAdmin = () => {
    form.setValue("email", "admin@example.com");
    form.setValue("password", "admin123");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn(values.email, values.password);
      if (res.data) {
        // Handle redirect
        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push(isAdmin ? "/admin/dashboard" : "/user/dashboard");
        }
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">CineVerse</span>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground text-center mb-2">
              👋 Quick Demo Access
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-3">
              For testing purposes, click below to auto-fill credentials
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoUser}
                disabled={isLoading}
              >
                Demo User
                {/* <span className="text-xs block text-muted-foreground">
                  Regular access
                </span> */}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoAdmin}
                disabled={isLoading}
              >
                Demo Admin
                {/* <span className="text-xs block text-muted-foreground">
                  Full access
                </span> */}
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
