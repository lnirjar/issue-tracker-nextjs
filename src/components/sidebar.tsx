import Link from "next/link";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-50 p-4 w-full">
      <Link href="/" className="block mt-1.5 mb-5 w-fit">
        <Image
          src="/logo.svg"
          alt="logo"
          width={336}
          height={141}
          priority
          className="w-16"
        />
      </Link>
      <Separator className="my-4" />
      <WorkspaceSwitcher />
      <Separator className="my-4" />
      <Navigation />
    </aside>
  );
};
