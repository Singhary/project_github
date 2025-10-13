/**
 * GitHub API Integration Module
 *
 * This module handles GitHub repository operations including:
 * - Fetching commit data from repositories
 * - Processing and summarizing commits using AI
 * - Managing commit data persistence in the database
 */

import { Octokit } from "octokit";
import axios from "axios";
import { db } from "~/server/db";
import { aiSummeriseCommit } from "./gemini";

// ==================== CONFIGURATION ====================

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// ==================== TYPES ====================

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

// ==================== PUBLIC API FUNCTIONS ====================

/**
 * Fetches the latest 10 commits from a GitHub repository
 * @param githubUrl - The GitHub repository URL (e.g., "https://github.com/owner/repo")
 * @returns Array of commit data sorted by date (newest first)
 */
export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid github URL");
  }

  // Fetch commits from GitHub API
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  // Sort commits by date (newest first)
  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author?.date).getTime() -
      new Date(a.commit.author?.date).getTime(),
  ) as any[];

  // Return formatted commit data (limit to 10 most recent)
  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

/**
 * Main function to poll and process new commits for a project
 * 1. Fetches latest commits from GitHub
 * 2. Filters out already processed commits
 * 3. Generates AI summaries for new commits
 * 4. Saves everything to the database
 *
 * @param projectId - The project ID to process commits for
 * @returns Database result of saved commits
 */
export const pollCommits = async (projectId: string) => {
  // Get project's GitHub URL
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

  // Fetch latest commits from GitHub
  const commitHashes = await getCommitHashes(githubUrl!);

  // Filter out commits we've already processed
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  if (unprocessedCommits.length === 0) {
    console.log("No new commits to process");
    return { count: 0 };
  }

  console.log(`Processing ${unprocessedCommits.length} new commits...`);

  // Generate AI summaries for new commits (with error handling)
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit, index) => {
      console.log(
        `Processing commit ${index + 1}/${unprocessedCommits.length}: ${commit.commitHash.slice(0, 8)}`,
      );
      return summeriseCommit(githubUrl!, commit.commitHash);
    }),
  );

  // Extract summaries with better error handling
  const summeries = summaryResponses.map((response, index) => {
    if (response.status === "fulfilled") {
      return response.value;
    } else {
      console.error(
        `Failed to summarize commit ${unprocessedCommits[index]?.commitHash}:`,
        response.reason,
      );
      // Return the specific error message from the AI function instead of generic message
      return response.reason?.message || "Failed to generate commit summary";
    }
  });

  // Save all processed commits to database
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

  console.log(`Successfully processed ${unprocessedCommits.length} commits`);
  return finalDbSavedCommits;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Generates an AI summary for a specific commit
 * Fetches the commit diff and passes it to the AI service
 */
async function summeriseCommit(githubUrl: string, commitHash: string) {
  // Get the diff data from GitHub
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  // Generate AI summary or return fallback message
  return (
    (await aiSummeriseCommit(data)) ||
    " Something went wrong while summarising the commit"
  );
}

/**
 * Retrieves the GitHub URL for a project from the database
 */
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

/**
 * Filters out commits that have already been processed and stored in the database
 */
async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  // Get all commits already stored for this project
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });

  // Return only commits that haven't been processed yet
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}
