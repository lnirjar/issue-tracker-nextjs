import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { QueryProvider } from "@/components/query-provider";
import { ClerkAuthListener } from "@/components/clerk-auth-listener";

import { Toaster } from "@/components/ui/sonner";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | Next.js`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "A full-stack issue tracking and project management app built with Next.js 15, MongoDB, Clerk, Cloudinary, Shadcn UI, and TypeScript. Features workspaces, projects, role-based access, and multiple task views like Kanban, Table, and Calendar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Issue Tracker" />
      </head>
      <body className={cn(geistSans.className, "antialiased min-h-screen")}>
        <ClerkProvider>
          <QueryProvider>
            {children}
            <ClerkAuthListener />
            <Toaster />
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
