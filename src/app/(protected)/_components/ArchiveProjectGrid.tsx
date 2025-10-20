import type { Project } from "@prisma/client";
import { FolderArchive } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";

type Props = {
  archivedProjects: Project[];
  selectedProjects: string[];
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>;
};

const ArchiveProjectGrid = ({
  archivedProjects,
  selectedProjects,
  setSelectedProjects,
}: Props) => {
  const handleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {archivedProjects.map((project) => (
        <Card
          key={project.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedProjects.includes(project.id)
              ? "ring-primary bg-primary/5 ring-2"
              : ""
          }`}
          onClick={() => handleSelectProject(project.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <Checkbox
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => handleSelectProject(project.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-lg">
                    {project.projectName}
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-xs">
                    Archived on{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <FolderArchive className="text-muted-foreground h-5 w-5 flex-shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground text-sm break-all">
                <span className="font-medium">Repository:</span>
                <br />
                <span className="text-xs">{project.repoUrl}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArchiveProjectGrid;
