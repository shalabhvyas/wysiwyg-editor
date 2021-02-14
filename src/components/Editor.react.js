import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import { convertFromSlate, convertToSlate } from "../utils/DocumentUtils";
import { useCallback, useMemo } from "react";

import { DefaultElement } from "slate-react";
import Image from "./Image.react";
import React from "react";
import Toolbar from "./Toolbar.react";
import { createEditor } from "slate";

function Editor({ document, onChange }): JSX.Element {
  const editor = useMemo(() => withReact(createEditor()), []);

  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  const onContentChange = useCallback(
    (content: Node[]) => {
      console.log(content);
      onChange(convertFromSlate(content));
    },
    [onChange]
  );

  return (
    <>
      <Toolbar />
      <div className="editor">
        <Slate
          editor={editor}
          value={convertToSlate(document)}
          onChange={onContentChange}
        >
          <Editable renderElement={renderElement} />
        </Slate>
      </div>
    </>
  );
}

function renderElement(props): JSX.Element {
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

export default Editor;
