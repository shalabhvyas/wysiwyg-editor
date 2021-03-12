import "./StyledText.css";

import { COMMENT_THREAD_MARK_NAME } from "../utils/EditorCommentUtils";
import React from "react";
import { activeCommentThreadIDAtom } from "./Editor";
import classNames from "classnames";
import useCommentedTextClickHandler from "../hooks/useCommentedTextClickHandler";
import { useRecoilState } from "recoil";

export default function StyledText({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  if (leaf[COMMENT_THREAD_MARK_NAME]) {
    return (
      <CommentedText
        {...attributes}
        commentThreads={leaf[COMMENT_THREAD_MARK_NAME]}
      >
        {children}
      </CommentedText>
    );
  }

  return <span {...attributes}>{children}</span>;
}

function CommentedText(props) {
  const { commentThreads, ...otherProps } = props;

  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );
  const onClick = useCommentedTextClickHandler(
    commentThreads,
    setActiveCommentThreadID
  );

  return (
    <span
      {...otherProps}
      className={classNames({
        comment: true,
        "is-active": commentThreads.has(activeCommentThreadID),
      })}
      onClick={onClick}
    >
      {props.children}
    </span>
  );
}
