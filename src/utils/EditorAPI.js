import { DefaultElement } from "slate-react";
import { Editor } from "slate";
import Image from "../components/Image.react";
import Link from "../components/Link.react";
import React from "react";
import StyledText from "../components/StyledText.react";
import { Transforms } from "slate";
import isHotkey from "is-hotkey";

export default class EditorAPI {
  _instance;

  constructor(instance) {
    this._instance = instance;

    // post initialization config.
    const { isVoid } = this._instance;
    this._instance.isVoid = (element) => {
      return element.type === "image" ? true : isVoid(element);
    };

    this._instance.isInline = (element) => element.type === "link";
  }

  getNode(path) {
    const entry = Editor.node(this._instance, path);
    return entry;
  }

  getActiveStyles() {
    return new Set(Object.keys(Editor.marks(this._instance) ?? {}));
  }

  getBlockType() {
    // instead do Editor.nodes with match set to isBlock.
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

    return currentBlockType;
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
    return null;
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
      return <Link {...props} />;
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
