"use client";
import { Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useRefetch from "~/hooks/use-refetch";
import { api } from "~/trpc/react";

type formInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreateForm = () => {
  const { register, handleSubmit, reset } = useForm<formInput>();

  const createProject = api.project.createProject.useMutation();

  const checkCredits = api.project.checkCredits.useMutation();
  console.log("checkCredits.data", checkCredits.data);

  const refetch = useRefetch();

  function onSubmit(data: formInput) {
    if (checkCredits.data) {
      createProject.mutate(
        {
          repoUrl: data.repoUrl,
          projectName: data.projectName,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast.success("Project created successfully");
            refetch();
          },
          onError: () => {
            toast.error("Failed to create project");
          },
        },
      );
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });
    }
  }

  const hasEnoughCredits = checkCredits?.data?.userHavingCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userHavingCredits
    : true;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("projectName", { required: true })}
        placeholder="Project Name"
        required
      />
      <div className="h-2"></div>
      <Input
        {...register("repoUrl", { required: true })}
        placeholder="Repository URL"
        type="url"
        required
      />
      <div className="h-2"></div>
      <Input
        {...register("githubToken")}
        placeholder="Github Token for private repo (optional)"
      />

      {checkCredits.data && (
        <>
          <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700">
            <div className="flex items-center gap-2">
              <Info className="size-4" />
              <p className="text-sm">
                You will be charged{" "}
                <strong>{checkCredits.data?.fileCount}</strong> credits for this
                repository.
              </p>
            </div>
            <p className="ml-6 text-sm text-blue-600">
              You have <strong>{checkCredits.data?.userHavingCredits}</strong>{" "}
              credits remaining.
            </p>
          </div>
        </>
      )}

      <div className="h-4"></div>
      <Button
        type="submit"
        disabled={
          createProject.isPending || checkCredits.isPending || !hasEnoughCredits
        }
      >
        {checkCredits.data ? "Create Project" : "Check Credits"}
      </Button>
    </form>
  );
};

export default CreateForm;
