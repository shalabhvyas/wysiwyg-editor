import "./CommentSidebar.css";

import { Editor, Path, Text, Transforms } from "slate";
import {
  activeCommentThreadIDAtom,
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import CommentRow from "./CommentRow";
import Row from "react-bootstrap/Row";
import classNames from "classnames";
import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";
import { useEditor } from "slate-react";

export default function CommentsSidebar() {
  const allCommentThreadIDs = useRecoilValue(commentThreadIDsState);

  return (
    <Card className={"comments-sidebar"}>
      <Card.Header>Comments</Card.Header>
      <Card.Body>
        {Array.from(allCommentThreadIDs).map((id) => (
          <Row key={id}>
            <Col>
              <CommentThread id={id} />
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
}

function CommentThread({ id }) {
  const editor = useEditor();
  const { comments, status } = useRecoilValue(commentThreadsState(id));
  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );
  const [shouldShowReplies, setShouldShowReplies] = useState(false);
  const onBtnClick = useCallback(() => {
    setShouldShowReplies(!shouldShowReplies);
  }, [shouldShowReplies, setShouldShowReplies]);

  const onClick = useCallback(() => {
    const textNodesWithThread = Editor.nodes(editor, {
      at: [],
      mode: "lowest",
      match: (n) => Text.isText(n) && getCommentThreadsOnTextNode(n).has(id),
    });

    let textNodeEntry = textNodesWithThread.next().value;
    const allTextNodePaths = [];
    while (textNodeEntry != null) {
      allTextNodePaths.push(textNodeEntry[1]);
      textNodeEntry = textNodesWithThread.next().value;
    }
    allTextNodePaths.sort((p1, p2) => Path.compare(p1, p2));

    Transforms.select(editor, {
      anchor: Editor.point(editor, allTextNodePaths[0], { edge: "start" }),
      focus: Editor.point(
        editor,
        allTextNodePaths[allTextNodePaths.length - 1],
        { edge: "end" }
      ),
    });

    setActiveCommentThreadID(id);
  }, [editor, id, setActiveCommentThreadID]);

  if (comments.length === 0) {
    return null;
  }

  const [firstComment, ...otherComments] = comments;
  return (
    <Card
      body={true}
      className={classNames({
        "comment-thread-container": true,
        "is-resolved": status === "resolved",
        "is-active": activeCommentThreadID === id,
      })}
      onClick={onClick}
    >
      <CommentRow comment={firstComment} showConnector={false} />
      {shouldShowReplies
        ? otherComments.map((comment, index) => (
            <CommentRow key={index} comment={comment} showConnector={true} />
          ))
        : null}
      {comments.length > 1 ? (
        <Button
          className={"show-replies-btn"}
          size="sm"
          variant="outline-primary"
          onClick={onBtnClick}
        >
          {shouldShowReplies ? "Hide Replies" : "Show Replies"}
        </Button>
      ) : null}
    </Card>
  );
}
