import {
  commentThreadIDsState,
  commentThreadsState,
} from "../components/Editor";

import { Editor } from "slate";
import { v4 as uuidv4 } from "uuid";

const COMMENT_THREAD_PREFIX = "commentThread_";

export function insertCommentThread(editor, setter) {
  const threadID = uuidv4();
  setter()(commentThreadsState, threadID, {
    comments: [],
    creationTime: new Date(),
  });
  setter(commentThreadIDsState, (ids) => new Set([...ids.values(), threadID]));
  Editor.addMark(editor, getMarkForCommentThreadID(threadID), true);
}

export function getMarkForCommentThreadID(threadID) {
  return `${COMMENT_THREAD_PREFIX}${threadID}`;
}

export function getCommentThreadIDFromMark(mark) {
  return mark.replace(COMMENT_THREAD_PREFIX, "");
}

export function isCommentThreadIDMark(mayBeMark) {
  return mayBeMark.indexOf(COMMENT_THREAD_PREFIX) === 0;
}

export function getCommentThreadsOnTextNode(textNode) {
  return new Set(
    Object.keys(textNode)
      .filter(isCommentThreadIDMark)
      .map(getCommentThreadIDFromMark)
  );
}
