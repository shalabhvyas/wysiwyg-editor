export default function CommentRow({
  comment: { author, text, creationTime },
}) {
  return (
    <div className={"comment-row"}>
      <div className="comment-author-photo">
        <i className="bi bi-person-circle comment-author-photo"></i>
      </div>
      <div>
        <span className="comment-author-name">{author}</span>
        <div className="comment-text">{text}</div>
      </div>
    </div>
  );
}
