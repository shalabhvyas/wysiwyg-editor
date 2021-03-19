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
import { useRecoilValue } from "recoil";

export default function CommentsSidebar(params) {
  const allCommentThreadIDs = useRecoilValue(commentThreadIDsState);

  return (
    <>
      {Array.from(allCommentThreadIDs).map((id) => (
        <Row key={id}>
          <Col>
            <CommentThread id={id} />
          </Col>
        </Row>
      ))}
    </>
  );
}

function CommentThread({ id }) {
  const { comments } = useRecoilValue(commentThreadsState(id));
  const [shouldShowReplies, setShouldShowReplies] = useState(false);
  const onBtnClick = useCallback(() => {
    setShouldShowReplies(!shouldShowReplies);
  }, [shouldShowReplies, setShouldShowReplies]);
  const [firstComment, ...otherComments] = comments;
  return (
    <Card body={true} className={"comment-thread-container"}>
      <CommentRow comment={firstComment} showConnector={false} />
      {shouldShowReplies
        ? otherComments.map((comment, index) => (
            <CommentRow key={index} comment={comment} showConnector={true} />
          ))
        : null}
      {comments.length > 1 ? (
        <Button variant="primary" onClick={onBtnClick}>
          {shouldShowReplies ? "Hide Replies" : "Show Replies"}
        </Button>
      ) : null}
    </Card>
  );
}
