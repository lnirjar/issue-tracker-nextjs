import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <Navbar />
        <div className="mt-6 flex flex-col gap-4">
          <h1 className="text-6xl font-bold">Issue Tracker</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores nam
            ipsam rem vitae a tempore, perferendis unde dolor rerum, veniam quas
            voluptas autem veritatis perspiciatis molestias, iusto omnis ullam
            quae?
          </p>
          <Button className="w-fit" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
