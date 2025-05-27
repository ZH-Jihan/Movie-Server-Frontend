import DashboardLayout from "@/components/dashboard/layout";
// import { useAuth } from "@/lib/use-auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();
  // const { user, isAdmin } = useAuth();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (!user || !isAdmin) {
  //     router.push("/login");
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [user, isAdmin, router]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       Loading...
  //     </div>
  //   );
  // }

  return <DashboardLayout children={children} />;
}
