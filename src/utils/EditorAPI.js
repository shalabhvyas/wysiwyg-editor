import { Editor, Element } from "slate";
import { Point, Range, Text, Transforms } from "slate";

import { DefaultElement } from "slate-react";
import Image from "../components/Image.react";
import Link from "../components/Link.react";
import LinkEditor from "../components/LinkEditor.react";
import React from "react";
import { ReactEditor } from "slate-react";
import StyledText from "../components/StyledText.react";
import isHotkey from "is-hotkey";
import urlRegex from "url-regex";

export default class EditorAPI {
  _instance;

  constructor(instance) {
    this._instance = instance;

    // post initialization config.
    const { isVoid } = this._instance;
    this._instance.isVoid = (element) => {
      return ["image", "link-editor"].includes(element.type) || isVoid(element);
    };

    this._instance.isInline = (element) =>
      ["link", "link-editor"].includes(element.type);
  }

  getNode(path) {
    const entry = Editor.node(this._instance, path);
    return entry;
  }

  getActiveStyles() {
    return new Set(Object.keys(Editor.marks(this._instance) ?? {}));
  }

  getTextBlockStyle() {
    // Change the logic below to basically find
    // - the closest block parent of the anchor
    // - siblings of anchor's block parent.
    // - all top level blocks b/w top level blocks of anchor and focus
    // - siblings of focus's closest block parent
    // - focus's closest block parent itself
    // - skip any void nodes that may have come in here.

    let selectedBlockRange = this.getSelectedBlockRange();
    if (selectedBlockRange == null) {
      return null;
    }

    let [startIndex, endIndex] = selectedBlockRange;
    let currentBlockType = null;
    while (startIndex <= endIndex) {
      // depth = 1 because node is a top level block element
      const node = this.getBlockNode([startIndex]);
      if (currentBlockType == null) {
        currentBlockType = node.type;
      } else if (currentBlockType !== node.type) {
        return "multiple";
      }
      startIndex++;
    }

    return currentBlockType !== "image" ? currentBlockType : null;
  }

  getBlockNode(path) {
    if (path.length !== 1) {
      throw Error("Expected single-element array path for block node");
    }
    return this.getNode(path)[0] ?? null;
  }

  getSelectedBlockRange() {
    if (this._instance.selection == null) {
      return null;
    }
    const anchorBlockIndex = this._instance.selection.anchor.path[0];
    // gotcha below when the focus path is [3,0,0] - start of the focus block.
    const focusBlockIndex = this._instance.selection.focus.path[0];

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

  getSelection() {
    return this._instance.selection;
  }

  getDOMNode(node) {
    // return findDOMNode(node);
    return ReactEditor.toDOMNode(this._instance, node);
  }

  getParent(path) {
    // mention that one can also use Node closest to local the node.
    return Editor.parent(this._instance, path);
  }

  toggleStyle(style) {
    const activeStyles = this.getActiveStyles();
    if (activeStyles.has(style)) {
      Editor.removeMark(this._instance, style);
    } else {
      Editor.addMark(this._instance, style, true);
    }
  }

  toggleBlockType(blockType) {
    const currentBlockType = this.getBlockType();
    const changeTo = currentBlockType === blockType ? "paragraph" : blockType;
    Transforms.setNodes(this._instance, { type: changeTo });
  }

  hasActiveLinkAtSelection() {
    const [result] = Editor.nodes(this._instance, {
      match: (n) => Element.isElement(n) && n.type === "link",
    });

    return result != null;
  }

  toggleLinkAtSelection() {
    if (this.hasActiveLinkAtSelection()) {
      Transforms.unwrapNodes(this._instance, {
        match: (n) => Element.isElement(n) && n.type === "link",
      });
    } else {
      const isSelectionCollapsed =
        this._instance.selection == null ||
        Range.isCollapsed(this._instance.selection);
      if (isSelectionCollapsed) {
        Transforms.insertNodes(this._instance, {
          type: "link",
          url: "",
          children: [{ text: "" }],
        });
      } else {
        Transforms.wrapNodes(
          this._instance,
          { type: "link", url: "", children: [{ text: "" }] },
          { split: true }
        );
      }
    }
  }
}

export function renderElement(props) {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "image":
      return <Image {...props} />;
    case "paragraph":
      return (
        <p {...attributes} content-editable={"true"}>
          {children}
        </p>
      );
    case "h1":
      return (
        <h1 {...attributes} content-editable={"true"}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...attributes} content-editable={"true"}>
          {children}
        </h2>
      );
    case "link":
      return <Link {...props} url={element.url} />;
    case "link-editor":
      return <LinkEditor {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

export function renderLeaf(props) {
  return <StyledText {...props} />;
}

export const KeyBindings = {
  onKeyDown: (api, event) => {
    if (isHotkey("mod+b", event)) {
      api.toggleStyle("bold");
      return;
    }
    if (isHotkey("mod+i", event)) {
      api.toggleStyle("italic");
      return;
    }
    if (isHotkey("mod+c", event)) {
      api.toggleStyle("code");
      return;
    }
    if (isHotkey("mod+u", event)) {
      api.toggleStyle("underline");
      return;
    }
  },
};

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
