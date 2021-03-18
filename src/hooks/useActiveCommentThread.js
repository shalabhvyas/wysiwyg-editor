import { useCallback, useState } from "react";

import { activeCommentThreadIDAtom } from "../utils/CommentState";
import { useSetRecoilState } from "recoil";

export default function useActiveCommentThread() {
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);
  const [commentTextNode, setCommentTextNode] = useState(null);

  const setActiveCommentThreadIDCallback = useCallback(
    (threadID, textNode) => {
      setActiveCommentThreadID(threadID);
      setCommentTextNode(textNode);
    },
    [setActiveCommentThreadID]
  );

  return [commentTextNode, setActiveCommentThreadIDCallback];
}
