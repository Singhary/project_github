import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summeriseCode } from "./gemini";
import { db } from "~/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignorePaths: [
      // Build and dependency directories
      "**/node_modules/**",
      "**/.git/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/logs/**",
      "**/tmp/**",
      "**/temp/**",

      // Lock files and package management
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",

      // Config and cache files
      ".eslintcache",
      "tsconfig.tsbuildinfo",
      "nextconfig.mjs",
      "package.json",
      ".DS_Store",
      "Thumbs.db",
      "desktop.ini",

      // Database and migration files
      "prisma/**",
      "**/migrations/**",
      "**/*.sql",

      // Media files
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.bmp",
      "**/*.svg",
      "**/*.ico",
      "**/*.webp",
      "**/*.mp4",
      "**/*.mov",
      "**/*.avi",
      "**/*.mp3",
      "**/*.wav",
      "**/*.pdf",

      // Documentation and markdown (optional - remove if you want to include)
      "**/*.md",
      "**/README*",
      "**/CHANGELOG*",
      "**/LICENSE*",
      "**/CONTRIBUTING*",

      // Log files
      "*.log",
      "**/*.log",

      // Environment and config files
      "**/.env*",
      "**/.*rc",
      "**/.*rc.js",
      "**/.*rc.json",
      "**/.gitignore",
      "**/.gitattributes",
      "**/vercel.json",
      "**/netlify.toml",

      // Test files (optional - remove if you want to include tests)
      "**/*.test.*",
      "**/*.spec.*",
      "**/test/**",
      "**/tests/**",
      "**/__tests__/**",

      // Style files (optional - remove if you want to analyze CSS/styling)
      "**/*.css",
      "**/*.scss",
      "**/*.sass",
      "**/*.less",

      // Data files
      "**/*.json", // Remove this if you need to analyze JSON configs
      "**/*.xml",
      "**/*.csv",
      "**/*.xlsx",
      "**/*.xls",

      // Archive files
      "**/*.zip",
      "**/*.tar",
      "**/*.gz",
      "**/*.rar",
    ],
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
