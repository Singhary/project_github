import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summeriseCode } from "./gemini";
import { db } from "~/server/db";
import ignorePaths from "config/ignorepath";
import { Octokit } from "octokit";

//GETTING FILE COUNT RECURSIVELY
const getFileCount = async (
  path: string,
  octoKit: Octokit,
  githubOwner: string,
  githubRepo: string,
  acc: number = 0,
) => {
  const { data } = await octoKit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path,
  });

  if (!Array.isArray(data) && data.type === "file") {
    return acc + 1;
  }

  if (Array.isArray(data)) {
    let fileCount = 0;

    const directories: string[] = [];

    for (const item of data) {
      if (item.type === "dir") {
        directories.push(item.path);
      } else {
        fileCount += 1;
      }
    }

    if (directories.length > 0) {
      const directoryCount = await Promise.all(
        directories.map((dirPath) =>
          getFileCount(dirPath, octoKit, githubOwner, githubRepo, 0),
        ),
      );
      fileCount += directoryCount.reduce((acc, count) => acc + count, 0);
    }
    return acc + fileCount;
  }
  return acc;
};

export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  const octoKit = new Octokit({
    auth: githubToken,
  });

  const githubOwner = githubUrl.split("/")[3];
  const githubRepo = githubUrl.split("/")[4];

  if (!githubOwner || !githubRepo) {
    return 0;
  }

  const fileCount = await getFileCount("", octoKit, githubOwner, githubRepo, 0);
  return fileCount;
};

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignorePaths: ignorePaths,
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  return docs;
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summeriseCode(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    }),
  );
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  console.log(`Loaded ${docs.length} documents from ${githubUrl}`);
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map(async (embedding, Index) => {
      console.log(
        `Indexed ${Index + 1} of ${allEmbeddings.length}: ${embedding.fileName}`,
      );
      if (!embedding.embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          projectId,
          fileName: embedding.fileName,
          souceCode: embedding.sourceCode,
          summary: embedding.summary,
        },
      });

      await db.$executeRaw`
       UPDATE "SourceCodeEmbedding" 
       SET "summaryEmbedding" = ${embedding.embedding}::vector
       WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};
