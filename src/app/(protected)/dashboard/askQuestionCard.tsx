"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import useProject from "~/hooks/use-project";
import { askQuestions } from "./actions";
import { readStreamableValue } from "@ai-sdk/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import useRefetch from "~/hooks/use-refetch";

const AskQuestionCard = () => {
  const { project, isLoading } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; summary: string; souceCode: string }[]
  >([]);
  const [answer, setAnswer] = useState<string>("");

  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent) => {
    setAnswer("");
    setFilesReferences([]);
    setStreamingComplete(false);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, filesReferences } = await askQuestions(
      question,
      project.id,
    );
    setOpen(true);
    setFilesReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }
    }

    setStreamingComplete(true);
    setLoading(false);
  };

  const refatch = useRefetch();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]" showCloseButton={false}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>
                <Image src={"/logo.png"} alt="logo" width={40} height={40} />
              </DialogTitle>
              <Button
               disabled={!streamingComplete || saveAnswer.isPending}
                variant={"outline"}
                onClick={() => {
                  saveAnswer.mutate({
                    projectId: project?.id!,
                    question,
                    answer,
                    filesReferences,
                  }, {
                    onSuccess: () => {
                      toast.success("Answer saved successfully");
                      refatch();
                    },
                    onError: () => {
                      toast.error("Failed to save the answer");
                    }
                  });
                }}
              >
                Save Answer
              </Button>
            </div>

            <Button
              type="button"
              size="icon"
              onClick={() => {
                setOpen(false);
              }}
              className="size-7 rounded-xl font-bold"
            >
              X
            </Button>
          </DialogHeader>

          <div data-color-mode="light">
            <MDEditor.Markdown
              source={answer}
              className="h-full max-h-[40vh] max-w-[75vw] overflow-scroll"
            />
            <div className="h-4"></div>
            {streamingComplete && (
              <CodeReferences fileReferences={filesReferences} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to make changes to home page?"
              value={question}
              onChange={(ev) => setQuestion(ev.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={!project || isLoading || loading}>
              Ask AI
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
