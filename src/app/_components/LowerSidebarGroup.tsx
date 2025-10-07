import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

const project = [
  {
    name: "Project 1",
  },
  { name: "Project 2" },
  { name: "Project 3" },
];

type LowerSidebarGroupProps = {
  isOpen: boolean;
};

export default function LowerSidebarGroup({isOpen}: LowerSidebarGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {project.map((project) => {
            return (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton asChild>
                  <div>
                    <div
                      className={cn(
                        "text-primary flex size-6 items-center justify-center rounded-sm border bg-white text-sm",
                        {
                          "bg-primary border-primary text-white": true,
                        },
                      )}
                    >
                      {project.name.charAt(0)}
                    </div>
                    <span className="mb-0.5">{project.name}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          <div className="h-2"></div>
          {isOpen && (
            <SidebarMenuItem>
              <Link href={"/create"}>
                <Button variant={"outline"} className="w-fit" size={"sm"}>
                  <Plus />
                  Create Project
                </Button>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
