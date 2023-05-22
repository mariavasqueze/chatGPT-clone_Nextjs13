"use client"; // this is a client side component

import { Session } from "next-auth";
import { SessionProvider as Provider } from "next-auth/react";
import { Chilanka } from "next/font/google";

type ProviderProps = {
  children: React.ReactNode; // child React nodes
  session: Session | null;
};

export function SessionProvider({ children, session }: ProviderProps) {
  return <Provider>{children}</Provider>;
}
