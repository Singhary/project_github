import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        repoUrl: z.string().url(),
        projectName: z.string().min(1).max(100),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.create({
        data: {
          projectName: input.projectName,
          repoUrl: input.repoUrl,
          githubToken: input.githubToken,
          userToProjects: {
            create: { 
                userId: ctx.user.userId!,     
            }
          }
        },
      });
      return project;
    }),
});
