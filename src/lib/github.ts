import { Octokit } from "octokit";
import { db } from "~/server/db";
import axios from "axios";
import { aiSummeriseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid github URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author?.date).getTime() -
      new Date(a.commit.author?.date).getTime(),
  ) as any[];

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

  const commitHashes = await getCommitHashes(githubUrl!);

  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summeriseCommit(githubUrl!, commit.commitHash);
    }),
  );

  const summeries = summaryResponses.map((responses) => {
    if (responses.status === "fulfilled") {
      return responses.value;
    } else {
      return " Something went wrong while summarising the commit";
    }
  });

  const finalDbSavedCommits = await db.commit.createMany({
    data: summeries.map((summary, index) => {
      return {
        projectId,
        commitHash: unprocessedCommits[index]?.commitHash!,
        commitMessage: unprocessedCommits[index]?.commitMessage!,
        commitAuthorName: unprocessedCommits[index]?.commitAuthorName!,
        commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar!,
        commitDate: unprocessedCommits[index]?.commitDate!,
        summary,
      };
    }),
  });

  return finalDbSavedCommits;
};

async function summeriseCommit(githubUrl: string, commitHash: string) {
  //get the diff and then pass the diff to gemini
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  return (
    (await aiSummeriseCommit(data)) ||
    " Something went wrong while summarising the commit"
  );
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      repoUrl: true,
    },
  });

  if (!project?.repoUrl) {
    throw new Error("Project has no repoUrl(githuburl)");
  }

  return {
    project,
    githubUrl: project?.repoUrl,
  };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}
