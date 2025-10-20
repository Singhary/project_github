"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import DeleteDialog from "../_components/DeleteDialog";
import ArchiveProjectGrid from "../_components/ArchiveProjectGrid";
import ArchiveHeaderSection from "../_components/ArchiveHeaderSection";
import ArchiveActionBar from "../_components/ArchiveActionBar";
import ArchiveDeleteAndUnarchiveButton from "../_components/ArchiveDeleteAndUnarchiveButton";
import NoProjectArchivedCard from "../_components/NoProjectArchivedCard";

const ArchivePage = () => {
  const { data: archivedProjects, refetch } =
    api.project.getAllArchivedProjects.useQuery();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      {/* Header Section */}
      <ArchiveHeaderSection />

      {/* Action Bar */}
      {archivedProjects && archivedProjects.length > 0 && (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
          <ArchiveActionBar
            archivedProjects={archivedProjects}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
          />

          <ArchiveDeleteAndUnarchiveButton
            refetch={refetch}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            setShowDeleteDialog={setShowDeleteDialog}
          />
        </div>
      )}

      {/* Projects Grid */}
      {archivedProjects && archivedProjects.length > 0 ? (
        <ArchiveProjectGrid
          archivedProjects={archivedProjects}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
        />
      ) : (
        <NoProjectArchivedCard />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        selectedProjects={selectedProjects}
        setSelectedProjects={setSelectedProjects}
        setShowDeleteDialog={setShowDeleteDialog}
        showDeleteDialog={showDeleteDialog}
      />
    </div>
  );
};

export default ArchivePage;
