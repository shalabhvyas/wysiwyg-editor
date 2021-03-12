import { useCallback } from "react";
import { useEditor } from "slate-react";

export default function useCommentedTextClickHandler(
  commentThreads,
  setActiveCommentThreadID
) {
  //const editor = useEditor();
  // Find the smallest comment range and render that.
  return useCallback(() => {
    console.log(commentThreads);
    const newActive = Array.from(commentThreads.values())[0];
    console.log("New active thread ID:", newActive);
    setActiveCommentThreadID(newActive);
  }, [commentThreads, setActiveCommentThreadID]);
}
