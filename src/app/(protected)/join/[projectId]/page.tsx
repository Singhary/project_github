import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { db } from "~/server/db";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinHandelr = async ({ params }: Props) => {
  const { projectId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        emailAddress: user.emailAddresses[0]?.emailAddress!,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  const project = await db.project.findUnique({
    where: {
        id: projectId,
    }
  })

  if(!project){
     redirect("/dashboard");
  }

  try {
    await db.userToProject.create({
        data: {
            userId: userId,
            projectId: projectId,
        }
    })
  } catch (error) {
    toast.error("You are already a member of this project");
    redirect("/dashboard");
  }


  return redirect(`/dashboard`);
};

export default JoinHandelr;
