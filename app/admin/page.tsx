"use client";

import Admin from "@/components/admin/Admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("CDCBtoken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(true);
  }, [router]);

  if (hasToken !== true) {
    return null;
  }

  return <Admin />;
}
