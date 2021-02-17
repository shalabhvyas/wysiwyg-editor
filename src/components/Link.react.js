import "./Link.css";

import { Editor, Node, Transforms } from "slate";

import { useCallback } from "react";
import { useEditor } from "slate-react";

export default function Link({ element, attributes, children }) {
  const editor = useEditor();
  const toggleEditMode = useCallback(
    (event) => {
      const linkNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "link",
      });

      if (linkNodeEntry == null) return;

      const [linkNode, path] = linkNodeEntry;

      const hasLinkEditorOpen = linkNode.children.some(
        (n) => n.type === "link-editor"
      );

      if (hasLinkEditorOpen) {
        return;
      }

      const linkEditorPath = [...path, linkNode.children.length];
      Transforms.insertNodes(
        editor,
        {
          type: "link-editor",
          url: element.url,
          linkText: Node.string(linkNode),
          children: [{ text: "" }],
        },
        { at: linkEditorPath }
      );
    },
    [editor, element.url]
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
