import { dbConnect } from "@/lib/db";
import { User } from "@/models/user";

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
    { name, email, username, avatar }
  ).exec();
};

export const deleteUser = async ({ clerkId }: { clerkId: string }) => {
  await dbConnect();

  return User.findOneAndDelete({ clerkId }).exec();

  // TODO: Delete user data
};
