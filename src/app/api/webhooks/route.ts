import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

import * as userUtils from "@/lib/user";

import {
  CLERK_USER_CREATED,
  CLERK_USER_DELETED,
  CLERK_USER_UPDATED,
} from "@/lib/constants";

type Payload = {
  data: {
    id: string;
    created_at: string;
    email_addresses: {
      email_address: string;
      id: string;
    }[];
    primary_email_address_id: string;
    profile_image_url: string;
    first_name: string;
    last_name: string;
    username: string;
  };
};

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload: Payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const webhookId = evt.data.id;
  const eventType = evt.type;
  console.log(
    `Received webhook with ID ${webhookId} and event type of ${eventType}`
  );
  // console.log("Webhook payload:", body);

  const {
    id,
    primary_email_address_id,
    email_addresses,
    profile_image_url,
    first_name,
    last_name,
    username,
  } = payload.data;

  const primaryEmailAddress = email_addresses
    ? email_addresses.find(({ id }) => id === primary_email_address_id)
        ?.email_address
    : "";

  const clerkId = id;
  const name = `${first_name} ${last_name}`;
  const email = primaryEmailAddress ?? "";
  const avatar = profile_image_url;

  console.log({ clerkId, name, email, avatar, username });

  if (eventType === CLERK_USER_CREATED) {
    await userUtils.createUser({
      clerkId,
      name,
      email,
      username,
      avatar,
    });
  }

  if (eventType === CLERK_USER_UPDATED) {
    await userUtils.updateUser({ clerkId, name, email, username, avatar });
  }

  if (eventType === CLERK_USER_DELETED) {
    await userUtils.deleteUser({ clerkId });
  }

  return new Response("Webhook received", { status: 200 });
}
