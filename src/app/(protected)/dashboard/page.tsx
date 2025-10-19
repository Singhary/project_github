"use client";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProject from "~/hooks/use-project";
import CommitLog from "./commit-log";
import AskQuestionCard from "./askQuestionCard";
import MeetingCard from "./meetingCard";
import ArchiveButton from "./archiveButton";
import TeamMember from "./TeamMember";
import dynamic from "next/dynamic";
const InviteButton = dynamic(() => import('./inviteButton'), { ssr: false });

const DashboardPage = () => {
  const { project, projectId } = useProject();

  // Show message if project is archived or not found
  if (projectId && !project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Project Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            This project has been archived or is no longer accessible.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Please select a different project from the sidebar or create a new
            one.
          </p>
        </div>
      </div>
    );
  }

  // Show message if no project is selected
  if (!projectId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            No Project Selected
          </h2>
          <p className="mt-2 text-gray-600">
            Please select a project from the sidebar or create a new one.
          </p>
        </div>
      </div>
    );
  }

  // Show message if project is archived
  if (project?.archiveStatus === "ARCHIVED") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Project Archived</h2>
          <p className="mt-2 text-gray-600">
            This project has been archived and is no longer accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {project?.id}
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* Github link part */}
        <div className="bg-primary w-fit rounded-md px-4 py-3">
          <div className="item-center flex">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.repoUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.repoUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          <TeamMember />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          <MeetingCard />
        </div>
      </div>

      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
};

export default DashboardPage;
