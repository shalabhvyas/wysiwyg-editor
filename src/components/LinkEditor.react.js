import "./LinkEditor.css";

import { Editor, Transforms } from "slate";
import { ReactEditor, useEditor } from "slate-react";
import { useCallback, useEffect, useRef, useState } from "react";

import isUrl from "is-url";

export default function LinkEditor({ editorOffsets }) {
  const linkEditorRef = useRef(null);
  const editor = useEditor();
  const [node, path] = Editor.above(editor, {
    match: (n) => n.type === "link",
  });

  const [linkURL, setLinkURL] = useState(node.url);
  const onLinkURLChange = useCallback(
    (event) => setLinkURL(event.target.value),
    [setLinkURL]
  );

  const onApply = useCallback(
    (event) => {
      Transforms.setNodes(editor, { url: linkURL }, { at: path });
    },
    [editor, linkURL, path]
  );

  // Explain why this needs to be in a `useEffect` since otherwise when adding
  // a new link DOMNode for the link might not have rendered yet and `ReactEditor.toDOMNode`
  // throws an error.
  useEffect(() => {
    const editorEl = linkEditorRef.current;
    if (editorEl == null) {
      return;
    }

    const linkDOMNode = ReactEditor.toDOMNode(editor, node);
    const {
      x: nodeX,
      height: nodeHeight,
      y: nodeY,
    } = linkDOMNode.getBoundingClientRect();

    editorEl.style.display = "block";
    editorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
    editorEl.style.left = `${nodeX - editorOffsets.x}px`;
  }, [editor, editorOffsets.x, editorOffsets.y, node]);

  if (editorOffsets == null) {
    return null;
  }

  return (
    <div ref={linkEditorRef} className={"link-editor"} style={{}}>
      <input
        style={{ margin: 8 }}
        type="text"
        value={linkURL}
        onChange={onLinkURLChange}
        onFocus={(event) => event.preventDefault()}
      />
      {/* Check if URL is valid */}
      <button disabled={!isUrl(linkURL)} onClick={onApply}>
        Apply
      </button>
      {/* <button onClick={onRemove}>Remove</button> */}
    </div>
  );
}
