"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";

type MarkerInput = {
  line: number;
  message: string;
  severity?: "error" | "warning";
};

type CodeEditorProps = {
  value: string;
  language: string;
  onChange: (value: string) => void;
  errors?: MarkerInput[];
  height?: number | string;
};

export default function CodeEditor({
  value,
  language,
  onChange,
  errors = [],
  height = 480,
}: CodeEditorProps) {
  const monaco = useMonaco();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useEffect(() => {
    if (!monaco || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers = (errors || []).map((e) => ({
      startLineNumber: Math.max(1, e.line),
      startColumn: 1,
      endLineNumber: Math.max(1, e.line),
      endColumn: Number.MAX_SAFE_INTEGER,
      message: e.message,
      severity:
        e.severity === "warning"
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Error,
    }));

    monaco.editor.setModelMarkers(model, "owner-errors", markers);
  }, [errors, monaco]);

  const handleMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    // Initialize markers on mount as well
    const model = editor.getModel();
    if (!model) return;
    const markers = (errors || []).map((e) => ({
      startLineNumber: Math.max(1, e.line),
      startColumn: 1,
      endLineNumber: Math.max(1, e.line),
      endColumn: Number.MAX_SAFE_INTEGER,
      message: e.message,
      severity:
        e.severity === "warning"
          ? monacoInstance.MarkerSeverity.Warning
          : monacoInstance.MarkerSeverity.Error,
    }));
    monacoInstance.editor.setModelMarkers(model, "owner-errors", markers);
  };

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/15 overflow-hidden bg-black/30 dark:bg-black/40 backdrop-blur">
      <Editor
        value={value}
        language={language}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        height={height}
        theme="vs-dark"
        options={{
          fontFamily:
            "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
          fontLigatures: true,
          fontSize: 14,
          roundedSelection: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          wordWrap: "on",
          smoothScrolling: true,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
}


