import "./Link.css";

import { useCallback, useContext, useRef } from "react";

import { EditorAPIContext } from "./Editor.react";

export default function Link({ element, attributes, children }) {
  const ref = useRef(null);
  const editorAPI = useContext(EditorAPIContext);
  const toggleEditMode = useCallback(
    (event) => {
      console.log("Mousedown event");
      event.preventDefault();
      editorAPI.isContextMenuShown()
        ? editorAPI.closeContextMenu()
        : editorAPI.showContextMenu(ref);
    },
    [editorAPI]
  );
  return (
    <a
      href={element.url}
      {...attributes}
      onMouseDown={toggleEditMode}
      ref={ref}
    >
      {children}
    </a>
  );
}
