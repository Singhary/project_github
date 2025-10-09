"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summeriseCommit = void 0;
var generative_ai_1 = require("@google/generative-ai");
var genAi = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
var model = genAi.getGenerativeModel({
    model: "gemini-2.0-flash-001",
});
var summeriseCommit = function (diff) { return __awaiter(void 0, void 0, void 0, function () {
    var DIFF_SUMMARY_PROMPT, response, summary, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                DIFF_SUMMARY_PROMPT = "# Role and Context\n  You are an expert programmer tasked with creating concise, informative summaries of git diffs for commit messages and code reviews.\n  \n  # Git Diff Format Reference\n  Understanding the structure:\n  - **File metadata**: Lines like `diff --git a/path/file.js b/path/file.js` indicate which file was modified\n  - **Index line**: Shows file hash and permissions (e.g., `index aadf001..bef003 100644`)\n  - **File markers**: `---` (old version) and `+++` (new version) show the file paths\n  - **Change indicators**:\n    - Lines starting with `+` were ADDED\n    - Lines starting with `-` were DELETED  \n    - Lines with neither are CONTEXT (not part of the change)\n  \n  # Task\n  Summarize the provided git diff by identifying what changed and why, focusing on functional changes rather than syntax details.\n  \n  # Output Format\n  Provide a bulleted list where each bullet:\n  1. Starts with an action verb (Added, Fixed, Moved, Removed, Updated, Refactored, etc.)\n  2. Describes WHAT changed functionally\n  3. Includes relevant file paths in square brackets [path/to/file]\n  4. Omits file paths if more than 2-3 files are involved in a single change\n  \n  # Guidelines\n  - Focus on meaningful changes (avoid mentioning whitespace, formatting)\n  - Group related changes across multiple files into one bullet\n  - Be specific but concise (aim for 10-15 words per bullet)\n  - Use technical terminology appropriate for developers\n  - Order bullets by importance/impact\n  \n  # Examples of Good Summaries\n  \n  **Example 1: Small feature addition**\n  ```\n  * Increased API recording limit from 10 to 100 records [packages/server/recordings_api.ts, packages/server/constants.ts]\n  * Fixed typo in GitHub Actions workflow name [.github/workflows/lint-commit-message.yml]\n  ```\n  \n  **Example 2: Refactoring**\n  ```\n  * Extracted Octokit initialization into dedicated module [src/octokit.ts, src/index.ts]\n  * Added OpenAI completions API integration [packages/utils/apis/openai.ts]\n  ```\n  \n  **Example 3: Multiple file changes**\n  ```\n  * Reduced numeric tolerance thresholds across test suite\n  * Removed deprecated authentication methods\n  ```\n  \n  # Critical Rules\n  - DO NOT copy these examples verbatim\n  - DO NOT include file paths for changes affecting 3+ files\n  - DO NOT summarize context lines (unchanged code)\n  - DO NOT include metadata lines in your analysis\n  \n  # Input\n  Please summarize the following git diff:\n  ";
                return [4 /*yield*/, model.generateContent([
                        "".concat(DIFF_SUMMARY_PROMPT, "\n  \n  ```\n  ").concat(diff, "\n  ```\n  "),
                    ])];
            case 1:
                response = _a.sent();
                summary = response.response.text();
                return [2 /*return*/, summary];
            case 2:
                error_1 = _a.sent();
                console.error("Error generating commit summary:", error_1);
                throw new Error("Failed to generate commit summary");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.summeriseCommit = summeriseCommit;
var runtest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var diff, summary, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                diff = "diff --git a/package-lock.json b/package-lock.json\nindex eb5dc52..e0258ed 100644\n--- a/package-lock.json\n+++ b/package-lock.json\n@@ -31,6 +31,7 @@\n         \"react-loading-skeleton\": \"^3.5.0\",\n         \"react-textarea-autosize\": \"^8.5.4\",\n         \"tailwind-merge\": \"^2.5.2\",\n+        \"tailwindcss-motion\": \"^0.3.0-beta\",\n         \"zod\": \"^3.23.8\"\n       },\n       \"devDependencies\": {\n@@ -8268,6 +8269,15 @@\n         \"node\": \">=14.0.0\"\n       }\n     },\n+    \"node_modules/tailwindcss-motion\": {\n+      \"version\": \"0.3.0-beta\",\n+      \"resolved\": \"https://registry.npmjs.org/tailwindcss-motion/-/tailwindcss-motion-0.3.0-beta.tgz\",\n+      \"integrity\": \"sha512-dBmakhcseaB7zK82H9zMmzNhAZFCA9DxWeuw0rkttIarur/7tnjWg1Nv9LlZZR9c+YctRyZns3D+1Fjbksq7Fg==\",\n+      \"license\": \"MIT\",\n+      \"peerDependencies\": {\n+        \"tailwindcss\": \">=3.0.0 || insiders\"\n+      }\n+    },\n     \"node_modules/tailwindcss/node_modules/object-hash\": {\n       \"version\": \"3.0.0\",\n       \"resolved\": \"https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz\",\ndiff --git a/package.json b/package.json\nindex f2df579..0a91c00 100644\n--- a/package.json\n+++ b/package.json\n@@ -32,6 +32,7 @@\n     \"react-loading-skeleton\": \"^3.5.0\",\n     \"react-textarea-autosize\": \"^8.5.4\",\n     \"tailwind-merge\": \"^2.5.2\",\n+    \"tailwindcss-motion\": \"^0.3.0-beta\",\n     \"zod\": \"^3.23.8\"\n   },\n   \"devDependencies\": {\ndiff --git a/src/app/(dashboard)/dashboard/add/loading.tsx b/src/app/(dashboard)/dashboard/add/loading.tsx\nindex b07491c..f6af9cd 100644\n--- a/src/app/(dashboard)/dashboard/add/loading.tsx\n+++ b/src/app/(dashboard)/dashboard/add/loading.tsx\n@@ -7,8 +7,8 @@ interface loadingProps {\n }\n \n const loading: FC<loadingProps> = ({}) => {\n-  return <div className='w-full flex flex-col gap-3'>\n-    <Skeleton className='mb-4' height={60} width={500} />\n+  return <div className='w-full flex flex-col gap-3 motion-preset-shrink motion-duration-1000'>\n+    <Skeleton className='mb-4 motion-preset-expand motion-duration-1000' height={60} width={500} />\n     <Skeleton height={20} width={150}/>\n     <Skeleton height={50} width={400}/>\n \ndiff --git a/src/app/(dashboard)/dashboard/layout.tsx b/src/app/(dashboard)/dashboard/layout.tsx\nindex b92ef72..9a9776c 100644\n--- a/src/app/(dashboard)/dashboard/layout.tsx\n+++ b/src/app/(dashboard)/dashboard/layout.tsx\n@@ -45,7 +45,7 @@ const Layout = async ({children}:LayoutProps) => {\n \n      <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>\n       <Link href={'/dashboard'} className='flex h-16 shrink-0 items-center'>\n-        <Icons.Logo className='h-8 w-auto text-indigo-600'/>\n+        <Icons.Logo className='h-8 w-auto text-indigo-600 motion-preset-slide-right motion-duration-2000'/>\n       </Link>\n      \n     {friends.length>0?(<div className='text-xs font-semibold leading-6 text-gray-400'>\ndiff --git a/tailwind.config.ts b/tailwind.config.ts\nindex 58da263..fec60cb 100644\n--- a/tailwind.config.ts\n+++ b/tailwind.config.ts\n@@ -22,6 +22,6 @@ const config: Config = {\n       },\n     },\n   },\n-  plugins: [require(\"@tailwindcss/forms\"),require('tailwind-scrollbar')],\n+  plugins: [require(\"@tailwindcss/forms\"),require('tailwind-scrollbar') , require(\"tailwindcss-motion\")],\n };\n export default config;";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Starting commit summary generation...");
                return [4 /*yield*/, (0, exports.summeriseCommit)(diff)];
            case 2:
                summary = _a.sent();
                console.log("Commit Summary:");
                console.log(summary);
                console.log("Summary generation completed successfully!");
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error in runtest:", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Execute the test function
runtest().catch(console.error);
