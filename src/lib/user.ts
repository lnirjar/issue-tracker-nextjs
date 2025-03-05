import { dbConnect } from "@/lib/db";
import { User } from "@/models/user";
import { auth } from "@clerk/nextjs/server";

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

  return User.findOneAndDelete({ clerkId }).exec();

  // TODO: Delete user data
};
