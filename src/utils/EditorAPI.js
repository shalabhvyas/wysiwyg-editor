import { DefaultElement } from "slate-react";
import { Editor } from "slate";
import Image from "../components/Image.react";
import React from "react";
import StyledText from "../components/StyledText.react";
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
  }

  toggleStyle(style) {
    const activeStyles = this.getActiveStyles();
    if (activeStyles.has(style)) {
      Editor.removeMark(this._instance, style);
    } else {
      Editor.addMark(this._instance, style, true);
    }
  }

  getActiveStyles() {
    return new Set(Object.keys(Editor.marks(this._instance) ?? {}));
  }

  getBlockType() {
    const e = Editor;
    return "paragraph";
  }

  toggleBlockType() {}
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
