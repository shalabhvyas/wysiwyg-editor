import { DefaultElement } from "slate-react";
import { Editor } from "slate";
import Image from "../components/Image.react";
import React from "react";
import StyledText from "../components/StyledText.react";

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
}

export function renderElement(props) {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "image":
      return <Image {...props} />;
    case "rich-text":
      return (
        <div {...attributes} content-editable={"true"}>
          {children}
        </div>
      );
    default:
      return <DefaultElement {...props} />;
  }
}

export function renderLeaf(props) {
  return <StyledText {...props} />;
}
