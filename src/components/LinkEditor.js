import "./LinkEditor.css";

import { Editor, Transforms } from "slate";
import { useCallback, useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NodePopover from "./NodePopover";
import isUrl from "is-url";
import { useEditor } from "slate-react";

export default function LinkEditor({ editorOffsets, selectionForLink }) {
  const editor = useEditor();
  const [node, path] = Editor.above(editor, {
    at: selectionForLink,
    match: (n) => n.type === "link",
  });

  const [linkURL, setLinkURL] = useState(node.url);

  useEffect(() => {
    setLinkURL(node.url);
  }, [node]);

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

  return (
    <NodePopover
      editorOffsets={editorOffsets}
      node={node}
      className={"link-editor"}
    >
      <Form.Control
        size="sm"
        type="text"
        value={linkURL}
        onChange={onLinkURLChange}
      />
      <Button
        className={"link-editor-btn"}
        size="sm"
        variant="primary"
        disabled={!isUrl(linkURL)}
        onClick={onApply}
      >
        Apply
      </Button>
    </NodePopover>
  );
}
