import "./CommentThreadPopover.css";

import {
  activeCommentThreadDataSelector,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import NodePopover from "./NodePopover";

export default function CommentThreadPopover({ editorOffsets, textNode }) {
  const activeCommentThreadData = useRecoilValue(
    activeCommentThreadDataSelector
  );
  const [commentText, setCommentText] = useState("");
  const {
    threadID,
    threadData: { comments },
  } = activeCommentThreadData;

  const setActiveCommentThreadData = useSetRecoilState(
    commentThreadsState(threadID)
  );

  const onClick = useCallback(() => {
    setActiveCommentThreadData((threadData) => ({
      ...threadData,
      comments: [
        ...threadData.comments,
        { text: commentText, author: "Shalabh", creationTime: new Date() },
      ],
    }));
  }, [commentText, setActiveCommentThreadData]);

  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={textNode}
      className={"comment-thread-popover"}
    >
      {comments.map(({ text, author }) => (
        <>
          <div>{text}</div>
          <div>{author}</div>
        </>
      ))}
      <input type="text" value={commentText} onClick={setCommentText} />
      <button onClick={onClick}>Add</button>
    </NodePopover>
  );
}
