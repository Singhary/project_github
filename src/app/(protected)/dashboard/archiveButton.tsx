"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import useProject from "~/hooks/use-project";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

const ArchiveButton = () => {
  const { projectId, setProjectId } = useProject();
  const archiveProject = api.project.archiveProject.useMutation();
  const refetch = useRefetch();
  const router = useRouter();

  return (
    <Button
      disabled={archiveProject.isPending}
      size="sm"
      variant="destructive"
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to archive this project? This action cannot be undone.",
        );

        if (confirm) {
          archiveProject.mutate(
            { projectId: projectId! },
            {
              onSuccess: () => {
                toast.success("Project archived successfully");
                // Clear the projectId from localStorage
                setProjectId(null);
                refetch();
                // Redirect to create page after archiving
                router.push("/create");
              },
              onError: () => {
                toast.error("Failed to archive project");
              },
            },
          );
        }
      }}
    >
      Archive Project
    </Button>
  );
};

export default ArchiveButton;
