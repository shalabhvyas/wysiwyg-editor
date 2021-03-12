import "./StyledText.css";

import { COMMENT_THREAD_MARK_NAME } from "../utils/EditorCommentUtils";
import React from "react";

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
      <span {...attributes} className={"comment"}>
        {children}
      </span>
    );
  }

  return <span {...attributes}>{children}</span>;
}
