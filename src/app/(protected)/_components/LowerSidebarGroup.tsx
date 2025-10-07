import { Loader, Plus } from "lucide-react";
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
import useProject from "~/hooks/use-project";
import { cn } from "~/lib/utils";

type LowerSidebarGroupProps = {
  isOpen: boolean;
};

export default function LowerSidebarGroup({ isOpen }: LowerSidebarGroupProps) {
  const { projects, projectId, setProjectId } = useProject();

  if (!projects || projects.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="text-muted-foreground flex items-center gap-2 px-2 py-4 text-sm">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Loading your projects...</span>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.map((project) => {
            return (
              <SidebarMenuItem key={project.projectName}>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => setProjectId(project.id)}
                    className={cn("flex items-center gap-2", {
                      "font-semibold": project.id === projectId,
                    })}
                  >
                    <div
                      className={cn(
                        "text-primary flex size-6 items-center justify-center rounded-sm border bg-white text-sm",
                        {
                          "bg-primary border-primary text-white":
                            project.id === projectId,
                        },
                      )}
                    >
                      {project.projectName.charAt(0).toUpperCase()}
                    </div>
                    <span className="mb-0.5">{project.projectName}</span>
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
