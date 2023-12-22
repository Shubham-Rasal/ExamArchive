"use client";

import { SessionProvider } from "next-auth/react";

type ProviderProps = {
  Component: any;
  pageProps: any;
};

export default function Provider({
  Component,
  pageProps: { session, ...pageProps },
}: ProviderProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
