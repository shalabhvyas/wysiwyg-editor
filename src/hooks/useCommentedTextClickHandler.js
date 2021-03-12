import { useCallback } from "react";
import { useEditor } from "slate-react";
export default function useCommentedTextClickHandler(commentThreads) {
  const editor = useEditor();
  // find the smallest comment thread and fire a recoil update to set
  // activeCommentThreadID to that.
  return useCallback(() => {}, []);
}
