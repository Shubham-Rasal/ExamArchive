"use client";

import signOutAction from "@/actions/auth/signOut/POST/signOutAction";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/route";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();

  const handleSignOut = async () => {
    const res = await signOutAction();
    if (res.hasError) return;
    router.replace(PageRoutes.auth.signIn);
  };
  return (
    <>
      <div>
        This will be the search page. Change the content of the page according
        to the requirements
      </div>
      <Button type="button" onClick={handleSignOut}>
        SignOut
      </Button>
    </>
  );
}
