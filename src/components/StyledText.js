import CommentedText from "./CommentedText";
import React from "react";
import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";

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

  const commentThreads = getCommentThreadsOnTextNode(leaf);

  if (commentThreads.size > 0) {
    return (
      <CommentedText
        {...attributes}
        commentThreads={commentThreads}
        textNode={leaf}
      >
        {children}
      </CommentedText>
    );
  }

  return <span {...attributes}>{children}</span>;
}
