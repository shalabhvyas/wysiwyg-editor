import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import EditorAPI, { renderElement, renderLeaf } from "../utils/EditorAPI";
import { convertFromSlate, convertToSlate } from "../utils/DocumentUtils";
import { useCallback, useMemo } from "react";

import React from "react";
import Toolbar from "./Toolbar.react";
import { createEditor } from "slate";

export const EditorAPIContext = React.createContext(null);

function Editor({ document, onChange }): JSX.Element {
  const slateEditor = useMemo(() => withReact(createEditor()), []);
  const editorAPI = useMemo(() => new EditorAPI(slateEditor), [slateEditor]);

  const onContentChange = useCallback(
    (content: Node[]) => {
      onChange(convertFromSlate(content));
    },
    [onChange]
  );

  return (
    <EditorAPIContext.Provider value={editorAPI}>
      <Slate
        editor={slateEditor}
        value={convertToSlate(document)}
        onChange={onContentChange}
      >
        <Toolbar />
        <div className="editor">
          <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        </div>
      </Slate>
    </EditorAPIContext.Provider>
  );
}

export default Editor;
