"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignIn, SignedOut, SignedIn } from "@clerk/nextjs";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

export const DemoLoginButton = ({
  className,
  showDivider = false,
  variant,
}: {
  className?: string;
  showDivider?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: "demo",
        password: "a#b#c#123",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.error(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedOut>
        <Button
          onClick={handleDemoLogin}
          disabled={loading}
          className={cn(className)}
          variant={variant}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
            </>
          ) : (
            "Login as Demo User"
          )}
        </Button>
      </SignedOut>
      <SignedIn>
        <p className="text-xs text-muted-foreground mt-1">
          Signed in successfully — redirecting...
        </p>
      </SignedIn>
      {showDivider && (
        <SignedOut>
          <div className="flex w-full max-w-[400px] items-center gap-2 my-8">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>
        </SignedOut>
      )}
    </>
  );
};
