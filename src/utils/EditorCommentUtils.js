import { Editor } from "slate";

export const COMMENT_THREAD_MARK_NAME = "commentThreads";

export function insertCommentThread(editor) {
  const existingCommentThreads =
    Editor.marks(editor)[COMMENT_THREAD_MARK_NAME] ?? new Set();
  const commentThreads = new Set([
    ...Array.from(existingCommentThreads.values()),
    "new_comment_1234",
  ]);
  Editor.addMark(editor, COMMENT_THREAD_MARK_NAME, commentThreads);
}
