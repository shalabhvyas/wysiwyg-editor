import { atom, useSetRecoilState } from "recoil";
import { useCallback, useState } from "react";

export const activeCommentThreadIDAtom = atom({
  key: "activeCommentThreadID",
  default: null,
});

export default function useActiveCommentThread() {
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);
  const [commentTextNode, setCommentTextNode] = useState(null);

  const setActiveCommentThreadIDCallback = useCallback(
    (threadID, textNode) => {
      console.log("Setting active to :", threadID);
      setActiveCommentThreadID(threadID);
      setCommentTextNode(textNode);
    },
    [setActiveCommentThreadID]
  );

  return [commentTextNode, setActiveCommentThreadIDCallback];
}
