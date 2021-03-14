import { ReactEditor, useEditor } from "slate-react";
import { useEffect, useRef } from "react";

import Card from "react-bootstrap/Card";

export default function NodePopover({
  node,
  children,
  editorOffsets,
  className,
}) {
  const popoverRef = useRef(null);
  const editor = useEditor();

  useEffect(() => {
    const editorEl = popoverRef.current;
    if (editorEl == null) {
      return;
    }

    const domNode = ReactEditor.toDOMNode(editor, node);
    const {
      x: nodeX,
      height: nodeHeight,
      y: nodeY,
    } = domNode.getBoundingClientRect();

    editorEl.style.display = "block";
    editorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
    editorEl.style.left = `${nodeX - editorOffsets.x}px`;
  }, [editor, editorOffsets.x, editorOffsets.y, node]);

  if (editorOffsets == null) {
    return null;
  }

  return (
    <Card ref={popoverRef} className={className}>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}
