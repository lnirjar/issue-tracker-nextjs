import { auth } from "@clerk/nextjs/server";

import "@/models";
import { User } from "@/models/user";
import { dbConnect } from "@/lib/db";

export const getCurrentUser = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  await dbConnect();

  const user = await User.findOne({ clerkId }).exec();

  return user;
};

export const createUser = async ({
  clerkId,
  name,
  email,
  username,
  avatar,
}: {
  clerkId: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
}) => {
  await dbConnect();

  return User.create({ clerkId, name, email, username, avatar });
};

export const updateUser = async ({
  clerkId,
  name,
  email,
  username,
  avatar,
}: {
  clerkId: string;
  name?: string;
  email?: string;
  username?: string;
  avatar?: string;
}) => {
  await dbConnect();

  return User.findOneAndUpdate(
    { clerkId },
    { name, email, username, avatar },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();
};

export const deleteUser = async ({ clerkId }: { clerkId: string }) => {
  await dbConnect();

  const updatedUser = await User.findOneAndUpdate(
    { clerkId },
    {
      name: "Deleted User",
      username: `deleteduser_${clerkId.slice(-6)}`,
      email: `deleteduser_${clerkId.slice(-6)}@example.com`,
      avatar: "",
    },
    { new: true }
  ).exec();

  return updatedUser;
};
