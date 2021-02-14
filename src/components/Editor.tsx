import { DocumentStructure } from "../utils/EditorTypes";
import { Editable, Slate, withReact } from "slate-react";
import { useCallback, useMemo } from "react";
import type { Node } from "slate";
import type { RenderElementProps } from "slate-react";
import React from "react";
import { createEditor } from "slate";
import { DefaultElement } from "slate-react";
import ImageComponent from "./ImageComponent";
import { convertFromSlate, convertToSlate } from "../utils/DocumentUtils";

type EditorProps = {
  document: DocumentStructure;
  onChange: (doc: DocumentStructure) => void;
};

function Editor({ document, onChange }: EditorProps): JSX.Element {
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
    [onChange, document]
  );

  return (
    <Slate
      editor={editor}
      value={convertToSlate(document)}
      onChange={onContentChange}
    >
      <Editable renderElement={renderElement} />
    </Slate>
  );
}

function renderElement(props: RenderElementProps): JSX.Element {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "image":
      return <ImageComponent {...props} />;
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
