import { SidebarDesktop } from "@/components/Sidebar";
import Header from "./components/Header";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex">
          <SidebarDesktop/>
          <div className="w-full flex flex-col px-6">
            <Header/>
            {children}
          </div>
        </div>
    );
  }
  