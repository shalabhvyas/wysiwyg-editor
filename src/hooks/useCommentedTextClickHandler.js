import { Editor } from "slate";
import { useCallback } from "react";
import { useEditor } from "slate-react";

export default function useCommentedTextClickHandler(
  commentThreads,
  setActiveCommentThreadID
) {
  const editor = useEditor();

  // Find the smallest comment range and render that.
  return useCallback(() => {
    const E = Editor;
    const sEditor = editor;
    console.log(commentThreads);

    const commentThreadsLengthByID = new Map(
      [...commentThreads].map((id) => [id, 1])
    );

    // Use Editor.previous recursively to find
    // text nodes that have at least one of these
    // commentThreads. Logic can stop if you can't find any
    // previous text nodes. In each iteration, keep incrementing
    // commentThreadsLengthByID.
    // Repeat the same logic with Editor.after and choose the
    // commentThread with smallest length.

    const newActive = Array.from(commentThreads.values())[0];
    console.log("New active thread ID:", newActive);
    setActiveCommentThreadID(newActive);
  }, [commentThreads, editor, setActiveCommentThreadID]);
}
