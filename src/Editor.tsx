import { DocumentStructure, RichTextComponent } from "./EditorTypes";
import { Editable, Slate, withReact } from "slate-react";
import { useCallback, useMemo } from "react";
import type { Node } from "slate";
import type { RenderElementProps } from "slate-react";
import React from "react";
import { createEditor } from "slate";
import { DefaultElement } from "slate-react";

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

  const onRichTextChange = useCallback(
    (content: Node[]) => {
      console.log(content);
      onChange({ ...document, content });
      //   onChange({
      //     ...document,
      //     content: [
      //       {
      //         type: "rich-text",
      //         children: [richTextComponent,
      //       },
      //     ],
      //   });
    },
    [onChange, document]
  );

  return (
    <Slate editor={editor} value={document.content} onChange={onRichTextChange}>
      <Editable renderElement={renderElement} />
    </Slate>
  );
}

function renderElement(props: RenderElementProps): JSX.Element {
  const { element, children, attributes } = props;
  switch (element.type) {
    case "image":
      return (
        <div {...attributes}>
          <div content-editable={"false"}>
            <img src={String(element.url)} />
          </div>
        </div>
      );
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
