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

  const linkNodeEntry = Editor.above(editor, {
    match: (n) => n.type === "link",
  });

  const onApply = useCallback(
    (event) => {
      if (linkNodeEntry == null) {
        return;
      }

      const [linkNode, path] = linkNodeEntry;

      // Try Editor.withoutNormalizing here to try to batch operations.
      // update URL
      Transforms.setNodes(editor, { url: linkURL }, { at: path });

      // remove all text leaves except the last one and the link editor itself.
      const textChildrenCount = linkNode.children.length - 2;
      for (let i = 0; i < textChildrenCount; i++) {
        Transforms.removeNodes(editor, { at: [...path, 0] });
      }

      Transforms.insertNodes(editor, { text: linkText }, { at: [...path, 0] });

      event.stopPropagation();
    },
    [editor, linkNodeEntry, linkText, linkURL]
  );

  const onClose = useCallback(
    (event) => {
      if (linkNodeEntry == null) {
        return;
      }

      const [linkNode, path] = linkNodeEntry;
      // Try Editor.withoutNormalizing here to try to batch operations.
      const all = [...Node.descendants(linkNode, {})];
      const selfNodeEntry = all.find(([n, path]) => n.type === "link-editor");
      Transforms.removeNodes(editor, { at: [...path, ...selfNodeEntry[1]] });
      Transforms.select(editor, path);
      event.stopPropagation();
    },
    [editor, linkNodeEntry]
  );

  if (linkNodeEntry == null) {
    return null;
  }

  // const onRemove = useCallback(
  //   (event) => {
  //     Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
  //     event.stopPropagation();
  //   },
  //   [editor]
  // );

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
      <button disabled={!isUrl(linkURL)} onClick={onApply}>
        Apply
      </button>
      <button onClick={onClose}>Close</button>
      {/* <button onClick={onRemove}>Remove</button> */}
      {children}
    </span>
  );
}
