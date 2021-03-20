import "./CommentSidebar.css";

import {
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";
import { useCallback, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import CommentRow from "./CommentRow";
import Row from "react-bootstrap/Row";
import classNames from "classnames";
import { useRecoilValue } from "recoil";

export default function CommentsSidebar(params) {
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
  const { comments, status } = useRecoilValue(commentThreadsState(id));
  const [shouldShowReplies, setShouldShowReplies] = useState(false);
  const onBtnClick = useCallback(() => {
    setShouldShowReplies(!shouldShowReplies);
  }, [shouldShowReplies, setShouldShowReplies]);

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
      })}
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
