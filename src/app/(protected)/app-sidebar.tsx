"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar";
import { UpperSidebarGroup } from "./_components/UpperSidebarGroup";
import LowerSidebarGroup from "./_components/LowerSidebarGroup";

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-lg bg-gray-50"
          />
          {open && <span className="text-lg font-bold size-7 ml-0.5">Codexa</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <UpperSidebarGroup pathname={pathname} />
        <LowerSidebarGroup isOpen={open} />
      </SidebarContent>
    </Sidebar>
  );
}
