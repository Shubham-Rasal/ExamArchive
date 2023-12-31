"use client";

import { ApiRoutes, PageRoutes } from "@/constants/route";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch(ApiRoutes.auth.signOut, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return;
    router.replace(PageRoutes.auth.signIn);
  };

  return (
    <div>
      <p>This is the dashboard page</p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
