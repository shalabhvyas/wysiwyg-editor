import { SetActiveCommentThreadIDContext } from "../utils/CommentState";
import { activeCommentThreadIDAtom } from "../utils/CommentState";
import classNames from "classnames";
import useCommentedTextClickHandler from "../hooks/useCommentedTextClickHandler";
import { useContext } from "react";
import { useRecoilValue } from "recoil";

export default function CommentedText(props) {
  const { commentThreads, ...otherProps } = props;
  const setActiveCommentThreadID = useContext(SetActiveCommentThreadIDContext);
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);

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
