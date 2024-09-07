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
          <div className="px-6 w-full flex flex-col">
            <Header/>
            {children}
          </div>
        </div>
    );
  }
  