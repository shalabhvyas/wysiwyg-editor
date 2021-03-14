import "./StyledText.css";

import React from "react";
import { activeCommentThreadIDAtom } from "./Editor";
import classNames from "classnames";
import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";
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

  const commentThreads = getCommentThreadsOnTextNode(leaf);

  if (commentThreads.size > 0) {
    return (
      <CommentedText {...attributes} commentThreads={commentThreads}>
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
