import type { Project } from "@prisma/client";
import React from "react";
import { Checkbox } from "~/components/ui/checkbox";

type Props = {
  archivedProjects: Project[];
  selectedProjects: string[];
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>;
};

const ArchiveActionBar = ({
  archivedProjects,
  selectedProjects,
  setSelectedProjects,
}: Props) => {
  const handleSelectAll = () => {
    if (selectedProjects.length === archivedProjects?.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(archivedProjects?.map((p) => p.id) || []);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="select-all"
        checked={
          selectedProjects.length === archivedProjects.length &&
          archivedProjects.length > 0
        }
        onCheckedChange={handleSelectAll}
      />
      <label
        htmlFor="select-all"
        className="cursor-pointer text-sm font-medium"
      >
        Select All ({selectedProjects.length} of {archivedProjects.length}{" "}
        selected)
      </label>
    </div>
  );
};

export default ArchiveActionBar;
