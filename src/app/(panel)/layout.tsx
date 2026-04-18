import { ceraProBold } from "../fonts";
import LayoutWrapper from "./layoutWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`min-h-screen flex flex-col ${ceraProBold.className} bg-background`}>
      <LayoutWrapper>{children}</LayoutWrapper>
    </main>
  );
}
