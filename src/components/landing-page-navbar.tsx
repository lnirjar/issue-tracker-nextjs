"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingPageNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center min-h-9">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo"
          width={231}
          height={43}
          priority
          className="w-48"
        />
      </Link>

      <div className="flex items-center gap-3">
        <SignedOut>
          {pathname !== "/sign-in" && (
            <Button variant="secondary" asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
          {pathname !== "/sign-up" && (
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          )}
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};
