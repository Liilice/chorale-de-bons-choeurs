"use client";

import Admin from "@/components/admin/Admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("CDCBtoken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return <Admin />;
}
