import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

import { dbConnect } from "@/lib/db";
import { User, USER_SELECT_ALL_FIELDS } from "@/models/user";

export const DashboardPage = async () => {
  const { userId: clerkId } = await auth();

  await dbConnect();
  const user = await User.findOne({ clerkId }).select(USER_SELECT_ALL_FIELDS);

  return (
    <div>
      {/* <div className="min-h-screen">
        <div className="mx-auto max-w-screen-2xl p-4"> */}
      {/* <Navbar /> */}
      <div className="mt-6 flex flex-col gap-4">
        <h1 className="text-6xl font-bold">Dashboard</h1>
        <p>{user?.name}</p>
        <p>{user?.username}</p>
        <p>{user?.email}</p>
        <p>{user?.clerkId}</p>
        <p>{user?.avatar}</p>
        {user?.avatar && (
          <Image
            src={user?.avatar}
            height={48}
            width={48}
            alt="avatar"
            className="w-12 rounded-full"
          />
        )}
      </div>
      {/* </div>
      </div> */}
    </div>
  );
};
