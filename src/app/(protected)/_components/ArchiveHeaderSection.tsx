import { Archive } from "lucide-react";
import React from "react";

const ArchiveHeaderSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <Archive className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Archived Projects</h1>
          <p className="text-muted-foreground text-sm">
            Manage your archived projects - restore or permanently delete them
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchiveHeaderSection;
