import "./LinkEditor.css";

import { Editor, Node, Transforms } from "slate";
import { useCallback, useState } from "react";

import isUrl from "is-url";
import { useEditor } from "slate-react";

export default function LinkEditor({ attributes, element, children }) {
  const editor = useEditor();
  const [linkText, setLinkText] = useState(element.linkText);
  const onLinkTextChange = useCallback(
    (event) => {
      setLinkText(event.target.value);
    },
    [setLinkText]
  );

  const [linkURL, setLinkURL] = useState(element.url);
  const onLinkURLChange = useCallback(
    (event) => setLinkURL(event.target.value),
    [setLinkURL]
  );

  const onApply = useCallback(
    (event) => {
      const [linkNode, path] = Editor.above(editor, {
        match: (n) => n.type === "link",
      });
      // update URL
      Transforms.setNodes(editor, { url: linkURL }, { at: path });

      // remove existing text
      const allTexts = Node.texts(linkNode);
      for (const text of allTexts) {
        Transforms.removeNodes(editor, { at: text[1] });
      }

      event.stopPropagation();
      // remove text
    },
    [editor, linkText, linkURL]
  );
  // get text for the node at path and show that here for editing.
  //   const editorInstance = useContext(EditorAPIContext);
  return (
    <span className={"link-editor"} contentEditable={false} {...attributes}>
      <input
        style={{ margin: 8 }}
        type="text"
        value={linkText}
        onChange={onLinkTextChange}
      />
      <input
        style={{ margin: 8 }}
        type="text"
        value={linkURL}
        onChange={onLinkURLChange}
      />
      {/* Check if URL is valid */}
      <button disabled={false && !isUrl(linkURL)} onClick={onApply}>
        Apply
      </button>
      {children}
    </span>
  );
}
