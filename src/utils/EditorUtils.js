import { Editor, Element } from "slate";
import { Point, Range, Text, Transforms } from "slate";

import urlRegex from "url-regex";

function getNode(editor, path) {
  const entry = Editor.node(editor, path);
  return entry;
}

export function getActiveStyles(editor) {
  return new Set(Object.keys(Editor.marks(editor) ?? {}));
}

export function getTextBlockStyle(editor) {
  // Change the logic below to basically find
  // - the closest block parent of the anchor
  // - siblings of anchor's block parent.
  // - all top level blocks b/w top level blocks of anchor and focus
  // - siblings of focus's closest block parent
  // - focus's closest block parent itself
  // - skip any void nodes that may have come in here.

  let selectedBlockRange = getSelectedBlockRange(editor);
  if (selectedBlockRange == null) {
    return null;
  }

  let [startIndex, endIndex] = selectedBlockRange;
  let currentBlockType = null;
  while (startIndex <= endIndex) {
    // depth = 1 because node is a top level block element
    const node = getBlockNode(editor, [startIndex]);
    if (currentBlockType == null) {
      currentBlockType = node.type;
    } else if (currentBlockType !== node.type) {
      return "multiple";
    }
    startIndex++;
  }

  return currentBlockType !== "image" ? currentBlockType : null;
}

function getBlockNode(editor, path) {
  if (path.length !== 1) {
    throw Error("Expected single-element array path for block node");
  }
  return getNode(editor, path)[0] ?? null;
}

function getSelectedBlockRange(editor) {
  if (editor.selection == null) {
    return null;
  }
  const anchorBlockIndex = editor.selection.anchor.path[0];
  // gotcha below when the focus path is [3,0,0] - start of the focus block.
  const focusBlockIndex = editor.selection.focus.path[0];

  let startIndex, endIndex;
  if (anchorBlockIndex <= focusBlockIndex) {
    startIndex = anchorBlockIndex;
    endIndex = focusBlockIndex;
  } else {
    startIndex = focusBlockIndex;
    endIndex = anchorBlockIndex;
  }

  return [startIndex, endIndex];
}

export function toggleStyle(editor, style) {
  const activeStyles = getActiveStyles();
  if (activeStyles.has(style)) {
    Editor.removeMark(editor, style);
  } else {
    Editor.addMark(editor, style, true);
  }
}

export function toggleBlockType(editor, blockType) {
  const currentBlockType = getTextBlockStyle();
  const changeTo = currentBlockType === blockType ? "paragraph" : blockType;
  Transforms.setNodes(editor, { type: changeTo });
}

export function hasActiveLinkAtSelection(editor) {
  const [result] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === "link",
  });

  return result != null;
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
      Transforms.insertNodes(editor, {
        type: "link",
        url: "",
        children: [{ text: "" }],
      });
    } else {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: "", children: [{ text: "" }] },
        { split: true }
      );
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
  const startOfText = Editor.point(editor, currentNodePath, { edge: "start" });
  while (
    Editor.string(editor, Editor.range(editor, start, end)) !== " " &&
    !Point.isBefore(start, startOfText)
  ) {
    end = start;
    start = Editor.before(editor, end, { unit: "character" });
  }

  const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
  const lastWord = Editor.string(editor, lastWordRange);

  if (urlRegex({ strict: false }).test(lastWord)) {
    requestAnimationFrame(() => {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: lastWord, children: [{ text: lastWord }] },
        { split: true, at: lastWordRange }
      );
    });
  }
}
