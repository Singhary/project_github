"use client";
import React from "react";
import useProject from "~/hooks/use-project";
import { api } from "~/trpc/react";
import MeetingCard from "../dashboard/meetingCard";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";

const MeetingPage = () => {
  const { projectId } = useProject();
  const { data: Meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId: projectId! },
    {
      refetchInterval: 4000,
    },
  );

  const refetch = useRefetch();
  const deleteMeeting = api.project.deleteMeeting.useMutation();

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-xl font-semibold">Meetings</h1>
      {Meetings && Meetings.length === 0 && (
        <p className="text-gray-500">No meetings found.</p>
      )}

      {isLoading && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {Meetings?.map((meeting) => {
          return (
            <li
              key={meeting.id}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="text-sm leading-6 font-semibold text-gray-900 hover:underline"
                    >
                      {meeting.name}
                    </Link>
                    {meeting.status === "PROCESSING" && (
                      <Badge className="bg-yellow-500 text-white">
                        Processing...
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-x-2 text-xs text-gray-500">
                  <p className="whitespace-nowrap">
                    {meeting.createdAt.toLocaleDateString()}
                  </p>
                  <p className="truncate">{meeting.issues.length} issues</p>
                </div>
              </div>

              <div className="flex flex-none items-center gap-x-4">
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="flex-shrink-0 hover:animate-pulse hover:underline"
                >
                  <Button variant="outline" size="sm">
                    View Meeting
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMeeting.isPending}
                  onClick={() => {
                    deleteMeeting.mutate(
                      { meetingId: meeting.id },
                      {
                        onSuccess: () => {
                          toast.success("Meeting deleted successfully");
                          refetch();
                        },
                        onError: () => {
                          toast.error(
                            "There was an error deleting the meeting",
                          );
                        },
                      },
                    );
                  }}
                >
                  Delete Meeting
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default MeetingPage;
