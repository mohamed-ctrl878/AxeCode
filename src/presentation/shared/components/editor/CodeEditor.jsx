import { Editor } from "@monaco-editor/react";
import React from "react";
// import Loader from "./Loader";
// import CodeEditorReplace from "./CodeEditorRep";

const CodeEditor = React.memo(
  ({
    options,
    loading,
    className,
    onChange,
    code,
    language,
    width,
    height,
    theme,
    fontResize,
  }) => (
    <Editor
      height={height}
      width={"100%"}
      className={className}
      language={language}
      value={code}
      loading={loading}
      options={options}
      theme={theme ? "vs-dark" : "vs-light"}
      onChange={(e) => {
        onChange(e);
      }}
    />
  )
);

export default CodeEditor;
