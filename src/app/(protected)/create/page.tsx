import React from "react";
import CreateForm from "../_components/CreateForm";

const CreatePage = () => {
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/undraw_pair-programming_9jyg.svg" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your Github Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your Repository to link to .......
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <CreateForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
