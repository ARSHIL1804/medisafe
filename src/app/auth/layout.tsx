import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-full">
        <Header />
        <div className="flex justify-center items-center flex-1 py-8 px-4 max-w-screen-xl lg:py-16 mx-auto w-full">
            {children}
        </div>
    </div>
  );
}
