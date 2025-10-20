import { FolderArchive } from "lucide-react";
import React from "react";
import { Card, CardContent } from "~/components/ui/card";

const NoProjectArchivedCard = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="bg-muted mb-4 rounded-full p-4">
          <FolderArchive className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">No Archived Projects</h3>
        <p className="text-muted-foreground max-w-md text-center">
          You don't have any archived projects. Archive projects from your
          dashboard to manage them here.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoProjectArchivedCard;
