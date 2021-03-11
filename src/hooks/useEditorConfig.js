import { DefaultElement } from "slate-react";
import Image from "../components/Image";
import Link from "../components/Link";
import LinkEditor from "../components/LinkEditor";
import React from "react";
import StyledText from "../components/StyledText";
import isHotkey from "is-hotkey";
import { toggleStyle } from "../utils/EditorUtils";

export default function useEditorConfig(editor) {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return ["image"].includes(element.type) || isVoid(element);
  };

  editor.isInline = (element) => ["link"].includes(element.type);

  return { renderElement, renderLeaf, KeyBindings };
}

function renderElement(props) {
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
    case "h3":
      return (
        <h3 {...attributes} content-editable={"true"}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...attributes} content-editable={"true"}>
          {children}
        </h4>
      );
    case "link":
      return <Link {...props} url={element.url} />;
    case "link-editor":
      return <LinkEditor {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
}

function renderLeaf(props) {
  return <StyledText {...props} />;
}

const KeyBindings = {
  onKeyDown: (editor, event) => {
    if (isHotkey("mod+b", event)) {
      toggleStyle(editor, "bold");
      return;
    }
    if (isHotkey("mod+i", event)) {
      toggleStyle(editor, "italic");
      return;
    }
    if (isHotkey("mod+c", event)) {
      toggleStyle(editor, "code");
      return;
    }
    if (isHotkey("mod+u", event)) {
      toggleStyle(editor, "underline");
      return;
    }
  },
};
