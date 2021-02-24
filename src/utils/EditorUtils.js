import { Editor, Element } from "slate";
import { Point, Range, Text, Transforms } from "slate";

import isUrl from "is-url";

export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}));
}

export function getTextBlockStyle(editor) {
  const selection = editor.selection;
  if (selection == null) {
    return null;
  }

  const topLevelBlockNodesInSelection = Editor.nodes(editor, {
    at: editor.selection,
    mode: "highest",
    match: (n) => Editor.isBlock(editor, n),
  });

  let blockType = null;
  let nodeEntry = topLevelBlockNodesInSelection.next();
  while (!nodeEntry.done) {
    const [node, _] = nodeEntry.value;
    if (blockType == null) {
      blockType = node.type;
    } else if (blockType !== node.type) {
      return "multiple";
    }

    nodeEntry = topLevelBlockNodesInSelection.next();
  }

  return blockType !== "image" ? blockType : null;
}

export function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles(editor);
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}

export function toggleBlockType(editor, blockType) {
  const currentBlockType = getTextBlockStyle(editor);
  const changeTo = currentBlockType === blockType ? "paragraph" : blockType;
  Transforms.setNodes(
    editor,
    { type: changeTo },
    { at: editor.selection, match: (n) => Editor.isBlock(editor, n) }
  );
}

export function hasActiveLinkAtSelection(editor) {
  return isLinkNodeAtSelection(editor, editor.selection);
}

export function toggleLinkAtSelection(editor) {
  if (hasActiveLinkAtSelection(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });
  } else {
    const isSelectionCollapsed =
      editor.selection == null || Range.isCollapsed(editor.selection);
    if (isSelectionCollapsed) {
      createLinkForRange(editor, null, "link", "", true /*isInsertion*/);
    } else {
      createLinkForRange(editor, editor.selection, "", "");
    }
  }
}

export function isLinkNodeAtSelection(editor, selection) {
  if (selection == null) {
    return false;
  }

  return (
    Editor.above(editor, {
      at: selection,
      match: (n) => n.type === "link",
    }) != null
  );
}

export function convertTextToLinkIfAny(editor) {
  if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
    return;
  }

  const [node, _] = Editor.parent(editor, editor.selection);
  if (node.type === "link") {
    return;
  }

  const [currentNode, currentNodePath] = Editor.node(editor, editor.selection);
  if (!Text.isText(currentNode)) {
    return;
  }

  let [start] = Range.edges(editor.selection);
  const cursorPoint = start;

  const startPointOfLastCharacter = Editor.before(editor, editor.selection, {
    unit: "character",
  });

  const lastCharacter = Editor.string(
    editor,
    Editor.range(editor, startPointOfLastCharacter, cursorPoint)
  );

  if (lastCharacter !== " ") {
    return;
  }

  let end = startPointOfLastCharacter;
  start = Editor.before(editor, end, { unit: "character" });
  const startOfTextNode = Editor.point(editor, currentNodePath, {
    edge: "start",
  });
  while (
    Editor.string(editor, Editor.range(editor, start, end)) !== " " &&
    !Point.isBefore(start, startOfTextNode)
  ) {
    end = start;
    start = Editor.before(editor, end, { unit: "character" });
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
  const lastWord = Editor.string(editor, lastWordRange);

  if (isUrl(lastWord)) {
    requestAnimationFrame(() => {
      createLinkForRange(editor, lastWordRange, lastWord, lastWord);
    });
  }
}

function createLinkForRange(editor, range, linkText, linkURL, isInsertion) {
  isInsertion
    ? Transforms.insertNodes(
        editor,
        {
          type: "link",
          url: linkURL,
          children: [{ text: linkText }],
        },
        range != null ? { at: range } : undefined
      )
    : Transforms.wrapNodes(
        editor,
        { type: "link", url: linkURL, children: [{ text: linkText }] },
        { split: true, at: range }
      );
}
