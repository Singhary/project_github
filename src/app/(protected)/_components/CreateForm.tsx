"use client";
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
  const refetch = useRefetch();

  function onSubmit(data: formInput) {
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
    return true;
  }

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
      <div className="h-4"></div>
      <Button type="submit" disabled={createProject.isPending}>
        Create Project
      </Button>
    </form>
  );
};

export default CreateForm;
