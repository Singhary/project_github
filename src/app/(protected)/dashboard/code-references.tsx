"use client";

import React, { useState } from "react";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { lucario } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "~/lib/utils";

type Props = {
  fileReferences: { fileName: string; summary: string; souceCode: string }[];
};

const CodeReferences = ({ fileReferences }: Props) => {
  const [tab, setTab] = useState(fileReferences[0]?.fileName || "");

  if (fileReferences.length === 0) return null;

  return (
    <div className="max-w-[75vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-scroll rounded-md bg-gray-200 p-1">
          {fileReferences.map((file) => (
            <button
              key={file.fileName}
              className={cn(
                "text-muted-foreground hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                {
                  "bg-primary text-primary-foreground": tab === file.fileName,
                  "hover:bg-primary/10": tab !== file.fileName,
                },
              )}
              onClick={() => setTab(file.fileName)}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {fileReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] max-w-7xl overflow-scroll rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={lucario}>
              {file.souceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
