import { LandingPageNavbar } from "@/components/landing-page-navbar";
import { DemoLoginButton } from "@/components/demo-login-button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-xl p-4">
        <LandingPageNavbar />
        <div className="flex flex-col items-center justify-center pt-14">
          <DemoLoginButton
            showDivider={true}
            className="w-full max-w-[400px]"
          />
          <div className="min-h-[480px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
