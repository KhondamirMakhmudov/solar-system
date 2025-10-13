// layouts/DashboardLayout.tsx
import Sidebar from "@/components/dashboard/sidebar";
import Head from "next/head";
import MainContentHeader from "@/components/dashboard/mainContentHeader";
import { useState } from "react";
export default function DashboardLayout({ children, headerTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="flex w-full h-screen">
      <Head>
        <title>{`${headerTitle || ""} | SCADA`}</title>
      </Head>

      <Sidebar isOpen={isSidebarOpen} />

      <main className="flex-1 p-6 bg-[#1A1625] overflow-auto">
        <MainContentHeader toggleSidebar={toggleSidebar}>
          {headerTitle}
        </MainContentHeader>
        {children}
      </main>
    </div>
  );
}
