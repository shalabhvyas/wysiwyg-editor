import "./CommentedText.css";

import { activeCommentThreadIDAtom } from "../utils/CommentState";
import classNames from "classnames";
import { getSmallestCommentThreadAtTextNode } from "../utils/EditorCommentUtils";
import { useEditor } from "slate-react";
import { useRecoilState } from "recoil";

export default function CommentedText(props) {
  const editor = useEditor();
  const { commentThreads, textNode, ...otherProps } = props;
  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );

  const onClick = () => {
    setActiveCommentThreadID(
      getSmallestCommentThreadAtTextNode(editor, textNode)
    );
  };

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
