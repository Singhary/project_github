import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../env.js";
import { Document } from "@langchain/core/documents";

const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

export const aiSummeriseCommit = async (diff: string): Promise<string> => {
  try {
    // Validate inputs
    if (!diff || typeof diff !== "string") {
      console.warn("Invalid diff provided to aiSummeriseCommit");
      return "No changes to summarize";
    }

    if (diff.length > 200000) {
      console.warn("Diff too large, truncating...");
      diff = diff.slice(0, 200000) + "\n\n[... diff truncated due to size ...]";
    }

    const DIFF_SUMMARY_PROMPT = `# Role and Context
  You are an expert programmer tasked with creating concise, informative summaries of git diffs for commit messages and code reviews.
  
  # Git Diff Format Reference
  Understanding the structure:
  - **File metadata**: Lines like \`diff --git a/path/file.js b/path/file.js\` indicate which file was modified
  - **Index line**: Shows file hash and permissions (e.g., \`index aadf001..bef003 100644\`)
  - **File markers**: \`---\` (old version) and \`+++\` (new version) show the file paths
  - **Change indicators**:
    - Lines starting with \`+\` were ADDED
    - Lines starting with \`-\` were DELETED  
    - Lines with neither are CONTEXT (not part of the change)
  
  # Task
  Summarize the provided git diff by identifying what changed and why, focusing on functional changes rather than syntax details.
  
  # Output Format
  Provide a bulleted list where each bullet:
  1. Starts with an action verb (Added, Fixed, Moved, Removed, Updated, Refactored, etc.)
  2. Describes WHAT changed functionally
  3. Includes relevant file paths in square brackets [path/to/file]
  4. Omits file paths if more than 2-3 files are involved in a single change
  
  # Guidelines
  - Focus on meaningful changes (avoid mentioning whitespace, formatting)
  - Group related changes across multiple files into one bullet
  - Be specific but concise (aim for 10-15 words per bullet)
  - Use technical terminology appropriate for developers
  - Order bullets by importance/impact
  
  # Examples of Good Summaries
  
  **Example 1: Small feature addition**
  \`\`\`
  * Increased API recording limit from 10 to 100 records [packages/server/recordings_api.ts, packages/server/constants.ts]
  * Fixed typo in GitHub Actions workflow name [.github/workflows/lint-commit-message.yml]
  \`\`\`
  
  **Example 2: Refactoring**
  \`\`\`
  * Extracted Octokit initialization into dedicated module [src/octokit.ts, src/index.ts]
  * Added OpenAI completions API integration [packages/utils/apis/openai.ts]
  \`\`\`
  
  **Example 3: Multiple file changes**
  \`\`\`
  * Reduced numeric tolerance thresholds across test suite
  * Removed deprecated authentication methods
  \`\`\`
  
  # Critical Rules
  - DO NOT copy these examples verbatim
  - DO NOT include file paths for changes affecting 3+ files
  - DO NOT summarize context lines (unchanged code)
  - DO NOT include metadata lines in your analysis
  
  # Input
  Please summarize the following git diff:
  `;

    console.log("Generating commit summary with Gemini AI...");

    const response = await model.generateContent([
      `${DIFF_SUMMARY_PROMPT}
  
  \`\`\`
  ${diff}
  \`\`\`
  `,
    ]);

    const summary = response.response.text();

    if (!summary || summary.trim() === "") {
      console.warn("Gemini API returned empty summary");
      return "Unable to generate summary - empty response from AI";
    }

    console.log("Successfully generated commit summary");
    return summary;
  } catch (error: any) {
    console.error("Error generating commit summary:", {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details || error.response?.data,
    });

    // Provide more specific error messages based on error type
    if (error.message?.includes("API_KEY")) {
      return "Error: Invalid or missing Gemini API key";
    } else if (
      error.message?.includes("QUOTA_EXCEEDED") ||
      error.status === 429
    ) {
      return "Error: Gemini API quota exceeded - please try again later";
    } else if (
      error.message?.includes("PERMISSION_DENIED") ||
      error.status === 403
    ) {
      return "Error: Gemini API access denied - check API key permissions";
    } else if (error.status >= 500) {
      return "Error: Gemini API server error - please try again later";
    } else if (
      error.message?.includes("network") ||
      error.code === "ECONNREFUSED"
    ) {
      return "Error: Network connection failed - check your internet connection";
    }

    return `Error generating summary: ${error.message || "Unknown error"}`;
  }
};

export async function summeriseCode(doc: Document) {
  console.log("Getting summery for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 100000);

  try {
    const response = await model.generateContent([
      `You are a senior software engineer writing technical documentation.
    
    Analyze this file: ${doc.metadata.source}
    
    \`\`\`
    ${code}
    \`\`\`
    
    Provide a 120-word technical summary for a new developer that covers:
    - Primary purpose and responsibility
    - Key functions/classes/exports and what they do
    - How it fits into the larger system
    - Notable dependencies or patterns
    
    Focus on what matters for understanding and modifying this code. Use clear, specific language.`,
    ]);

    return response.response.text();
  } catch (error) {
    return "";
  }
}

export async function generateEmbedding(summary: string) {
  const model = genAi.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
}
