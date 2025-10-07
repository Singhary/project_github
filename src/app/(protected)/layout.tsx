import { UserButton } from "@clerk/nextjs";
import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

type props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="item-center border-sidebar-border bg-sidebar flex gap-2 rounded-md border p-2 px-4 shadow">
          {/* <SearchBar/> */}
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>

        <div className="h-4">
          {/* main content */}
          <div className="border-sidebar-border bg-sidebar h-[calc(100vh-0rem)] overflow-y-scroll rounded-md border p-4 shadow">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
