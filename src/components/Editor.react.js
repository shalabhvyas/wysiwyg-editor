import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import EditorAPI, { renderElement, renderLeaf } from "../utils/EditorAPI";
import { convertFromSlate, convertToSlate } from "../utils/DocumentUtils";
import { useCallback, useMemo } from "react";

import EditorContextMenu from "./EditorContextMenu.react";
import { KeyBindings } from "../utils/EditorAPI";
import React from "react";
import Toolbar from "./Toolbar.react";
import { createEditor } from "slate";

export const EditorAPIContext = React.createContext(null);

function Editor({ document, onChange }): JSX.Element {
  const slateEditor = useMemo(() => withReact(createEditor()), []);
  const editorAPI = useMemo(() => new EditorAPI(slateEditor), [slateEditor]);
  const refForContextMenu = editorAPI.getRefForContextMenu();

  const onContentChange = useCallback(
    (content: Node[]) => {
      onChange(convertFromSlate(content));
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editorAPI, event),
    [editorAPI]
  );

  return (
    <EditorAPIContext.Provider value={editorAPI}>
      {refForContextMenu != null ? (
        <EditorContextMenu context={refForContextMenu} />
      ) : null}
      <Slate
        editor={slateEditor}
        value={convertToSlate(document)}
        onChange={onContentChange}
      >
        <Toolbar />
        <div className="editor">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
          />
        </div>
      </Slate>
    </EditorAPIContext.Provider>
  );
}

export default Editor;
