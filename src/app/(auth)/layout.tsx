import AuthBackground from "@/components/auth/AuthBackground";
import { ceraProBold } from "../fonts";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="min-h-[100vh] flex bg-background">
        <AuthBackground />
        <div className="min-h-screen flex flex-col justify-center mx-auto w-[90%] lg:w-[40%] absolute lg:right-24 right-0 left-0 lg:left-auto">
          <div className="h-full flex items-center justify-center bg-primary py-5 rounded-3xl">
            <div
              className={`w-[90%] md:w-[80%] lg:w-[75%] ${ceraProBold.className} `}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
