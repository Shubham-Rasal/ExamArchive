import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN } from "./constants/constants";
import { verifyTokens } from "./helpers/jsonwebtokens";

export const config = {
  matcher: ["/dashboard/:path*", "/auth/(signIn|newUser)"],
};

export async function middleware(request: NextRequest) {
  const url = request.url;
  const authToken = cookies().get(AUTH_TOKEN);

  if (authToken?.value && request.nextUrl.pathname.startsWith("/auth")) {
    const verifiedUser = await verifyTokens({ token: authToken.value });
    if (verifiedUser) return NextResponse.redirect(new URL("/dashboard", url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!authToken)
      return NextResponse.redirect(new URL("/auth/signIn", url));
    const verifiedUser = await verifyTokens({ token: authToken.value });
    if (!verifiedUser)
      return NextResponse.redirect(new URL("/auth/signIn", url));
  }

  return NextResponse.next();
}
