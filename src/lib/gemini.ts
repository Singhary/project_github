import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../env.js";

const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

export const summeriseCommit = async (diff: string): Promise<string> => {
  try {
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

    const response = await model.generateContent([
      `${DIFF_SUMMARY_PROMPT}
  
  \`\`\`
  ${diff}
  \`\`\`
  `,
    ]);

    const summary = response.response.text();
    return summary;
  } catch (error) {
    console.error("Error generating commit summary:", error);
    throw new Error("Failed to generate commit summary");
  }
};
