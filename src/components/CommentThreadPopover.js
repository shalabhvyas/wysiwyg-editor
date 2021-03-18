import "./CommentThreadPopover.css";

import {
  activeCommentThreadDataSelector,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NodePopover from "./NodePopover";

export default function CommentThreadPopover({ editorOffsets, textNode }) {
  const {
    threadID,
    threadData: { comments },
  } = useRecoilValue(activeCommentThreadDataSelector);
  const setActiveCommentThreadData = useSetRecoilState(
    commentThreadsState(threadID)
  );

  const [commentText, setCommentText] = useState("");

  const onClick = useCallback(() => {
    setActiveCommentThreadData((threadData) => ({
      ...threadData,
      comments: [
        ...threadData.comments,
        { text: commentText, author: "Shalabh", creationTime: new Date() },
      ],
    }));
    setCommentText("");
  }, [commentText, setActiveCommentThreadData, setCommentText]);

  const onCommentTextChange = useCallback(
    (event) => setCommentText(event.target.value),
    [setCommentText]
  );

  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={textNode}
      className={"comment-thread-popover"}
    >
      {comments.map(({ text, author }, index) => (
        <div key={index}>
          <div>{text}</div>
          <div>{author}</div>
        </div>
      ))}
      <div>
        <InputGroup>
          <Form.Control
            autoFocus={true}
            type="text"
            value={commentText}
            onChange={onCommentTextChange}
          />
          <InputGroup.Append>
            <Button
              variant="outline-primary"
              active={commentText.length > 0}
              onClick={onClick}
            >
              <i className={`bi bi-arrow-right-circle-fill`} />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </NodePopover>
  );
}
