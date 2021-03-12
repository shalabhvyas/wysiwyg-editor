import { Editor } from "slate";
import { v4 as uuidv4 } from "uuid";

export const COMMENT_THREAD_MARK_NAME = "commentThreads";

export function insertCommentThread(editor) {
  const existingCommentThreads =
    Editor.marks(editor)[COMMENT_THREAD_MARK_NAME] ?? new Set();
  const commentThreads = new Set([
    ...Array.from(existingCommentThreads.values()),
    uuidv4(),
  ]);
  Editor.addMark(editor, COMMENT_THREAD_MARK_NAME, commentThreads);
}
