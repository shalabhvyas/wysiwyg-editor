import { Editor, Text } from "slate";
import {
  activeCommentThreadIDAtom,
  commentThreadIDsState,
  commentThreadsState,
} from "./CommentState";

import { getFirstTextNodeAtSelection } from "./EditorUtils";
import { v4 as uuidv4 } from "uuid";

const COMMENT_THREAD_PREFIX = "commentThread_";

export function insertCommentThread(editor, setter) {
  const threadID = uuidv4();
  setter()(commentThreadsState(threadID), {
    comments: [],
    creationTime: new Date(),
  });
  setter()(
    commentThreadIDsState,
    (ids) => new Set([...ids.values(), threadID])
  );
  setter()(activeCommentThreadIDAtom, threadID);
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
  if (textNode == null) {
    debugger;
  }
  return new Set(
    Object.keys(textNode)
      .filter(isCommentThreadIDMark)
      .map(getCommentThreadIDFromMark)
  );
}

export function isCommentAtSelection(editor, selection) {
  const textNode = getFirstTextNodeAtSelection(editor, selection);
  return textNode != null && getCommentThreadsOnTextNode(textNode).size > 0;
}

export function getSmallestCommentThreadAtTextNode(editor, textNode) {
  const commentThreads = getCommentThreadsOnTextNode(textNode);
  const commentThreadsAsArray = [...commentThreads];

  let newActiveCommentThreadID = commentThreadsAsArray[0];

  if (commentThreads.size > 1) {
    const commentThreadsLengthByID = new Map(
      commentThreadsAsArray.map((id) => [id, textNode.text.length])
    );

    updateCommentThreadLengthMap(
      editor,
      commentThreads,
      Editor.previous,
      commentThreadsLengthByID
    );

    updateCommentThreadLengthMap(
      editor,
      commentThreads,
      Editor.next,
      commentThreadsLengthByID
    );

    let minLength = Number.POSITIVE_INFINITY;

    for (let [threadID, length] of commentThreadsLengthByID) {
      if (length < minLength) {
        newActiveCommentThreadID = threadID;
        minLength = length;
      }
    }
  }

  return newActiveCommentThreadID;
}

function updateCommentThreadLengthMap(
  editor,
  commentThreads,
  nodeIterator,
  map
) {
  let nextNodeEntry = nodeIterator(editor);
  while (nextNodeEntry != null && Text.isText(nextNodeEntry[0])) {
    const nextNode = nextNodeEntry[0];
    const commentThreadsOnNextNode = getCommentThreadsOnTextNode(nextNode);
    const intersection = [...commentThreadsOnNextNode].filter((x) =>
      commentThreads.has(x)
    );
    // All comment threads we're looking for have already ended.
    if (intersection.size === 0) {
      break;
    }

    for (let i = 0; i < intersection.length; i++) {
      map.set(intersection[i], map.get(intersection[i]) + nextNode.text.length);
    }

    nextNodeEntry = nodeIterator(editor, { at: nextNodeEntry[1] });
  }

  return map;
}

export function initializeStateWithAllCommentThreads(
  editor,
  setCommentThreadData
) {
  const textNodesWithComments = Editor.nodes(editor, {
    at: [],
    mode: "lowest",
    match: (n) => Text.isText(n) && getCommentThreadsOnTextNode(n).size > 0,
  });

  const commentThreads = new Set();

  let textNodeEntry = textNodesWithComments.next().value;
  while (textNodeEntry != null) {
    [...getCommentThreadsOnTextNode(textNodeEntry[0])].forEach((threadID) => {
      commentThreads.add(threadID);
    });
    textNodeEntry = textNodesWithComments.next().value;
  }

  console.log(commentThreads);

  // Fetch comment threads from server and use the setter to set them here. For the sake
  // of the article, we just set them to some default so we know the initialization works.
  [...commentThreads.entries()].forEach((id) =>
    setCommentThreadData(id, {
      comments: [
        {
          author: "Manisha",
          text: "Comment Loaded from Server",
          creationTime: new Date(),
        },
      ],
    })
  );
}
