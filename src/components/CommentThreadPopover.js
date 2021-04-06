import "./CommentThreadPopover.css";

import { ReactEditor, useEditor } from "slate-react";
import {
  activeCommentThreadIDAtom,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilStateLoadable, useSetRecoilState } from "recoil";

import Button from "react-bootstrap/Button";
import CommentRow from "./CommentRow";
import Form from "react-bootstrap/Form";
import NodePopover from "./NodePopover";
import { Text } from "slate";
import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";
import { getFirstTextNodeAtSelection } from "../utils/EditorUtils";

export default function CommentThreadPopover({
  editorOffsets,
  selection,
  threadID,
}) {
  const inputRef = useRef();
  const editor = useEditor();
  const textNode = getFirstTextNodeAtSelection(editor, selection);

  const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom);

  const [threadDataLoadable, setCommentThreadData] = useRecoilStateLoadable(
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

  const onToggleStatus = useCallback(() => {
    const currentStatus = threadDataLoadable.contents.status;
    setCommentThreadData((threadData) => ({
      ...threadData,
      status: currentStatus === "open" ? "resolved" : "open",
    }));
  }, [setCommentThreadData, threadDataLoadable.contents.status]);

  const onCommentTextChange = useCallback(
    (event) => setCommentText(event.target.value),
    [setCommentText]
  );

  const onClickOutside = useCallback(
    (event) => {
      const slateDOMNode = event.target.hasAttribute("data-slate-node")
        ? event.target
        : event.target.closest(`[data-slate-node]`);

      // The click event was somewhere outside the Slate hierarchy
      if (slateDOMNode == null) {
        setActiveCommentThreadID(null);
        return;
      }

      const slateNode = ReactEditor.toSlateNode(editor, slateDOMNode);

      // Click is on another commented text node => do nothing.
      if (
        Text.isText(slateNode) &&
        getCommentThreadsOnTextNode(slateNode).size > 0
      ) {
        return;
      }

      setActiveCommentThreadID(null);
    },
    [editor, setActiveCommentThreadID]
  );

  useEffect(() => {
    //inputRef.current?.focus();
    return () => {
      setActiveCommentThreadID(null);
    };
  }, [setActiveCommentThreadID]);

  const hasThreadData = threadDataLoadable.state === "hasValue";
  const threadData = threadDataLoadable.contents;

  return (
    <NodePopover
      editorOffsets={editorOffsets}
      isBodyFullWidth={true}
      node={textNode}
      className={"comment-thread-popover"}
      header={
        <Header
          status={threadData.status ?? null}
          shouldAllowStatusChange={
            hasThreadData && threadData.comments.length > 0
          }
          onToggleStatus={onToggleStatus}
        />
      }
      onClickOutside={onClickOutside}
    >
      {hasThreadData ? (
        <>
          <div className={"comment-list"}>
            {threadData.comments.map((comment, index) => (
              <CommentRow key={index} comment={comment} />
            ))}
          </div>
          <div className={"comment-input-wrapper"}>
            <Form.Control
              bsPrefix={"comment-input form-control"}
              placeholder={"Type a comment"}
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={onCommentTextChange}
            />
            <Button
              size="sm"
              variant="primary"
              disabled={commentText.length === 0}
              onClick={onClick}
            >
              Comment
            </Button>
          </div>
        </>
      ) : (
        "Loading"
      )}
    </NodePopover>
  );
}

function Header({ onToggleStatus, shouldAllowStatusChange, status }) {
  return (
    <div className={"comment-thread-popover-header"}>
      {shouldAllowStatusChange && status != null ? (
        <Button size="sm" variant="primary" onClick={onToggleStatus}>
          {status === "open" ? "Resolve" : "Re-Open"}
        </Button>
      ) : null}
    </div>
  );
}
