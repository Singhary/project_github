import type { RefetchOptions } from "@tanstack/react-query";
import { RotateCcw, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

type Props = {
  selectedProjects: string[];
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const ArchiveDeleteAndUnarchiveButton = ({
  selectedProjects,
  setSelectedProjects,
  setShowDeleteDialog,
  refetch,
}: Props) => {
  const unarchiveMutation = api.project.unArchiveTheProject.useMutation();
  const deleteMutation = api.project.deleteProjects.useMutation();
  const projectReFetch = useRefetch()

  const handleUnarchive = () => {
    if (selectedProjects.length === 0) {
      toast.error("Please select at least one project");
      return;
    }
    unarchiveMutation.mutate(selectedProjects, {
      onSuccess: () => {
        toast.success("Projects unarchived successfully!");
        setSelectedProjects([]);
        refetch();
        projectReFetch()
      },
      onError: (error) => {
        toast.error(`Failed to unarchive projects: ${error.message}`);
      },
    });
  };

  const handleDelete = () => {
    if (selectedProjects.length === 0) {
      toast.error("Please select at least one project");
      return;
    }
    setShowDeleteDialog(true);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnarchive}
        disabled={selectedProjects.length === 0 || unarchiveMutation.isPending}
      >
        <RotateCcw className="h-4 w-4" />
        Unarchive
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={selectedProjects.length === 0 || deleteMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default ArchiveDeleteAndUnarchiveButton;
