import "./LinkEditor.css";

import { useCallback, useContext, useState } from "react";

import { EditorAPIContext } from "./Editor.react";

export default function LinkEditor({ text, link }) {
  const [linkText, setLinkText] = useState(text);
  const onLinkTextChange = useCallback(
    (event) => setLinkText(event.targer.value),
    [setLinkText]
  );
  const editorInstance = useContext(EditorAPIContext);
  const textAtSelection = editorInstance.getLinkTextAtSelection();
  return <span className="link-editor">Link:</span>;
}
