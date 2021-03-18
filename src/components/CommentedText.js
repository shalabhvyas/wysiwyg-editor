import { activeCommentThreadIDAtom } from "../utils/CommentState";
import classNames from "classnames";
import { getSmallestCommentThreadAtTextNode } from "../utils/EditorCommentUtils";
import { getTextNodeAtSelection } from "../utils/EditorUtils";
import { useEditor } from "slate-react";
import { useRecoilState } from "recoil";

export default function CommentedText(props) {
  const editor = useEditor();
  const { commentThreads, ...otherProps } = props;
  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );

  const onClick = () => {
    const textNode = getTextNodeAtSelection(editor);
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
