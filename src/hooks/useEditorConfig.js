import { DefaultElement } from "slate-react";
import Image from "../components/Image.react";
import Link from "../components/Link.react";
import LinkEditor from "../components/LinkEditor.react";
import React from "react";
import StyledText from "../components/StyledText.react";
import isHotkey from "is-hotkey";

export default function useEditorConfig(editor) {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return ["image", "link-editor"].includes(element.type) || isVoid(element);
  };

  editor.isInline = (element) => ["link", "link-editor"].includes(element.type);

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
