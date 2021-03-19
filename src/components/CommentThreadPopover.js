import "./CommentThreadPopover.css";

import {
  activeCommentThreadIDAtom,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NodePopover from "./NodePopover";
import { getFirstTextNodeAtSelection } from "../utils/EditorUtils";
import { useEditor } from "slate-react";

export default function CommentThreadPopover({
  editorOffsets,
  selectionForActiveComment,
  threadID,
}) {
  const editor = useEditor();
  const textNode = getFirstTextNodeAtSelection(
    editor,
    selectionForActiveComment
  );
  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);

  const [{ comments }, setCommentThreadData] = useRecoilState(
    commentThreadsState(threadID)
  );

  const [commentText, setCommentText] = useState("");

  const onClick = useCallback(() => {
    setCommentThreadData((threadData) => ({
      ...threadData,
      comments: [
        ...threadData.comments,
        { text: commentText, author: "Shalabh", creationTime: new Date() },
      ],
    }));
    setCommentText("");
  }, [commentText, setCommentThreadData]);

  const onCommentTextChange = useCallback(
    (event) => setCommentText(event.target.value),
    [setCommentText]
  );

  useEffect(() => {
    return () => {
      setActiveCommentThreadID(null);
    };
  }, [setActiveCommentThreadID]);

  return (
    <NodePopover
      editorOffsets={editorOffsets}
      isBodyFullWidth={true}
      node={textNode}
      className={"comment-thread-popover"}
    >
      <div className={"comment-list"}>
        {comments.map((comment, index) => (
          <CommentRow key={index} comment={comment} />
        ))}
      </div>
      <div className={"comment-input-wrapper"}>
        <Form.Control
          autoFocus={true}
          bsPrefix={"comment-input form-control"}
          placeholder={"Type a comment"}
          type="text"
          value={commentText}
          onChange={onCommentTextChange}
        />
        <Button
          variant="primary"
          disabled={commentText.length === 0}
          onClick={onClick}
        >
          Comment
        </Button>
      </div>
    </NodePopover>
  );
}

function CommentRow({ comment: { author, text, creationTime } }) {
  return (
    <div className={"comment-row"}>
      <div className="comment-author-photo">
        <i className="bi bi-person-circle comment-author-photo"></i>
      </div>
      <div>
        <span className="comment-author-name">{author}</span>
        <div className="comment-text">{text}</div>
      </div>
    </div>
  );
}
