import "./Link.css";

import { Editor } from "slate";
import { appendLinkEditorToLinkNode } from "../utils/EditorAPI";
import { useCallback } from "react";
import { useEditor } from "slate-react";

export default function Link({ element, attributes, children }) {
  const editor = useEditor();
  const toggleEditMode = useCallback(
    (event) => {
      const linkNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "link",
      });

      appendLinkEditorToLinkNode(editor, linkNodeEntry);
    },
    [editor]
  );

  return (
    <a
      href={element.url}
      onMouseUp={toggleEditMode}
      {...attributes}
      className={"link"}
    >
      {children}
    </a>
  );
}
