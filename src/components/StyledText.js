import "./StyledText.css";

import { COMMENT_THREAD_MARK_NAME } from "../utils/EditorCommentUtils";
import React from "react";
import { activeCommentThreadIDAtom } from "./Editor";
import useCommentedTextClickHandler from "../hooks/useCommentedTextClickHandler";
import { useRecoilValue } from "recoil";

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
  const onClick = useCommentedTextClickHandler(commentThreads);
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  // Create a custom selector that returns true/falsee if
  // activeCommentThreadID from Recoil is contained in commentThreads.
  return (
    <span {...otherProps} className={"comment"} onClick={onClick}>
      {props.children}
    </span>
  );
}
