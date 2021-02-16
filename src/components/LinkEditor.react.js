import "./LinkEditor.css";

// import { useCallback, useContext, useState } from "react";

// import { EditorAPIContext } from "./Editor.react";

export default function LinkEditor({ node, path }) {
  //   const [linkText, setLinkText] = useState(text);
  //   const onLinkTextChange = useCallback(
  //     (event) => setLinkText(event.targer.value),
  //     [setLinkText]
  //   );
  // get text for the node at path and show that here for editing.
  //   const editorInstance = useContext(EditorAPIContext);
  return <span className="link-editor">Path:{path}</span>;
}
