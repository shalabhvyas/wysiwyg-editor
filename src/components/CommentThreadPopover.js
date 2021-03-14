import "./CommentThreadPopover.css";

import NodePopover from "./NodePopover";
import { activeCommentThreadIDAtom } from "../hooks/useActiveCommentThread";
import { useRecoilValue } from "recoil";

export default function CommentThreadPopover({ editorOffsets, textNode }) {
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={textNode}
      className={"comment-thread-popover"}
    >
      <div>{"Comment Thread Popover:" + activeCommentThreadID}</div>
    </NodePopover>
  );
}
