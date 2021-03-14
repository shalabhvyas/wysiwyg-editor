import { Editor, Text } from "slate";

import { getCommentThreadsOnTextNode } from "../utils/EditorCommentUtils";
import { useCallback } from "react";
import { useEditor } from "slate-react";

export default function useCommentedTextClickHandler(
  commentThreads,
  setActiveCommentThreadID
) {
  const editor = useEditor();

  // Find the smallest comment range and render that.
  return useCallback(() => {
    console.log(commentThreads);

    const [currentTextNode] = Editor.node(editor, editor.selection);
    const commentThreadsAsArray = [...commentThreads];

    let newActiveCommentThreadID = commentThreadsAsArray[0];

    if (commentThreads.size > 1) {
      const commentThreadsLengthByID = new Map(
        commentThreadsAsArray.map((id) => [id, currentTextNode.text.length])
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

    setActiveCommentThreadID(newActiveCommentThreadID, currentTextNode);
  }, [commentThreads, editor, setActiveCommentThreadID]);
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
