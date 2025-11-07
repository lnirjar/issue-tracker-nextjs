import { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Login",
};

export default function SignInPage() {
  return <SignIn />;
}
