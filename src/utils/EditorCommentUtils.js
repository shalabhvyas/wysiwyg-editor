import { Editor, Range, Text } from "slate";

import { getFirstTextNodeAtSelection } from "./EditorUtils";
import { v4 as uuidv4 } from "uuid";

const COMMENT_THREAD_PREFIX = "commentThread_";

export function shouldAllowNewCommentThreadAtSelection(editor, selection) {
  if (selection == null || Range.isCollapsed(selection)) {
    return false;
  }

  const textNodeIterator = Editor.nodes(editor, {
    at: selection,
    mode: "lowest",
  });

  let nextTextNodeEntry = textNodeIterator.next().value;
  const textNodeEntriesInSelection = [];
  while (nextTextNodeEntry != null) {
    textNodeEntriesInSelection.push(nextTextNodeEntry);
    nextTextNodeEntry = textNodeIterator.next().value;
  }

  if (textNodeEntriesInSelection.length === 0) {
    return false;
  }

  // If any text is uncommented on, later on, user could click on that
  // text to see details of this thread so allow a new comment thread
  // to be created.
  return textNodeEntriesInSelection.some(
    ([textNode]) => getCommentThreadsOnTextNode(textNode).size === 0
  );
}

export function insertCommentThread(editor, addCommentThread) {
  const threadID = uuidv4();
  addCommentThread(threadID, {
    comments: [],
    creationTime: new Date(),
    status: "open",
  });
  Editor.addMark(editor, getMarkForCommentThreadID(threadID), true);
  return threadID;
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

  const reverseTextNodeIterator = (slateEditor, nodePath) =>
    Editor.previous(slateEditor, {
      at: nodePath,
      mode: "lowest",
      match: Text.isText,
    });

  const forwardTextNodeIterator = (slateEditor, nodePath) =>
    Editor.next(slateEditor, {
      at: nodePath,
      mode: "lowest",
      match: Text.isText,
    });

  if (commentThreads.size > 1) {
    const commentThreadsLengthByID = new Map(
      commentThreadsAsArray.map((id) => [id, textNode.text.length])
    );

    updateCommentThreadLengthMap(
      editor,
      commentThreads,
      reverseTextNodeIterator,
      commentThreadsLengthByID
    );

    updateCommentThreadLengthMap(
      editor,
      commentThreads,
      forwardTextNodeIterator,
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
  while (nextNodeEntry != null) {
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

    nextNodeEntry = nodeIterator(editor, nextNodeEntry[1]);
  }

  return map;
}

export async function initializeStateWithAllCommentThreads(
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

  // Fetch comment threads from server and use the setter to set them here. For the sake
  // of the article, we just set them to some default so we know the initialization works.
  Array.from(commentThreads).forEach((id) =>
    setCommentThreadData(id, {
      comments: [
        {
          author: "Jane Doe",
          text: "Comment Thread Loaded from Server",
          creationTime: new Date(),
        },
      ],
      status: "open",
    })
  );
}
