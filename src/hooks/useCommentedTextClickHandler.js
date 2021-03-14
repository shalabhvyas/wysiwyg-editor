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
    const E = Editor;
    const sEditor = editor;
    console.log(commentThreads);

    const currentTextNode = Editor.node(editor, editor.selection);
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

      const [minLength, threadIDOfSmallestLength] = [
        ...commentThreadsLengthByID.entries(),
      ].reduce(
        ([minLengthSoFar, smallestThreadID], [length, threadID]) => {
          if (length < minLengthSoFar) {
            return [threadID, length];
          }
          return [minLengthSoFar, smallestThreadID];
        },
        [
          commentThreadsLengthByID.get(newActiveCommentThreadID),
          newActiveCommentThreadID,
        ]
      );

      newActiveCommentThreadID = threadIDOfSmallestLength;
      console.log("minLength:", minLength);
    }

    console.log("New active thread ID:", newActiveCommentThreadID);
    setActiveCommentThreadID(currentTextNode, newActiveCommentThreadID);
  }, [commentThreads, editor, setActiveCommentThreadID]);
}

function updateCommentThreadLengthMap(
  editor,
  commentThreads,
  nodeIterator,
  map
) {
  let [nextNode, nextNodePath] = nodeIterator(editor);
  while (Text.isText(nextNode)) {
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

    [nextNode, nextNodePath] = nodeIterator(editor, { at: nextNodePath });
  }

  return map;
}
