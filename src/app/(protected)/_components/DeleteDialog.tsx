import { AlertCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

type Props = {
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProjects: string[];
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>;
};

const DeleteDialog = ({
  selectedProjects,
  setShowDeleteDialog,
  showDeleteDialog,
  setSelectedProjects,
}: Props) => {
  const deleteMutation = api.project.deleteProjects.useMutation();
  const refetch = useRefetch();

  const confirmDelete = () => {
    deleteMutation.mutate(selectedProjects, {
      onSuccess: () => {
        toast.success("Projects deleted successfully!");
        setSelectedProjects([]);
        setShowDeleteDialog(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete projects. Please try again.");
      },
    });
  };

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="text-destructive h-5 w-5" />
            Permanently Delete Projects?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            {selectedProjects.length} project
            {selectedProjects.length !== 1 ? "s" : ""}? This action cannot be
            undone and will remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
