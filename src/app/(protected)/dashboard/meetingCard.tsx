"use client";
import React, { useState } from "react";
import { Card } from "~/components/ui/card";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "~/lib/firebase";
import { Presentation, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { api } from "~/trpc/react";
import useProject from "~/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const MeetingCard = () => {
  const { project } = useProject();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const processMeeting = useMutation({
    mutationFn: async (data: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      const { meetingUrl, meetingId, projectId } = data;
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });
      return response.data;
    },
  });

  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      const file = acceptedFiles[0];

      if (!file) return;

      const downloadURL = await uploadFile(file! as File, setProgress);
      if (downloadURL) {
        uploadMeeting.mutate(
          {
            projectId: project?.id!,
            meetingUrl: downloadURL as string,
            name: file.name,
          },
          {
            onSuccess: (meeting) => {
              toast.success("Meeting uploaded successfully");
              router.push("/meetings");
              processMeeting.mutate({
                meetingUrl: downloadURL as string,
                meetingId: meeting.id,
                projectId: project?.id!,
              })
            },
            onError: () => {
              toast.error("There was an error uploading your meeting");
            },
          },
        );
      }
      setIsUploading(false);
    },
  });

  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>

          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting using Codexa.
            <br />
            Powered by AI.
          </p>

          <div className="mt-6">
            <Button disabled={isUploading}>
              <Upload className="mr-1.5 -ml-0.5 h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
            })}
          />
          <p className="text-center text-sm text-gray-500">
            Uploading your meeting....
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
