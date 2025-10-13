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

const AskQuestionCard = () => {
  const { project, isLoading } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; summary: string; souceCode: string }[]
  >([]);
  const [ansewer, setAnswer] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    const { output, filesReferences } = await askQuestions(
      question,
      project.id,
    );
    setFilesReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          </DialogHeader>
          
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
            <Button type="submit" disabled={!project || isLoading}>
              Ask AI
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
