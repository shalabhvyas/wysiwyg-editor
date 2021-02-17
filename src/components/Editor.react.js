import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import EditorAPI, { renderElement, renderLeaf } from "../utils/EditorAPI";
import { useCallback, useMemo, useReducer } from "react";

import { KeyBindings } from "../utils/EditorAPI";
import React from "react";
import Toolbar from "./Toolbar.react";
import { createEditor } from "slate";
import useSelection from "../hooks/useSelection";

export const EditorAPIContext = React.createContext(null);
export const EditorDispatchContext = React.createContext(null);

function reduce(state, action) {
  switch (action.type) {
    case "toggle_selection_menu":
      return {
        ...state,
        shouldShowSelection: !state.shouldShowSelection,
      };
    default:
      return state;
  }
}

function Editor({ document, onChange }): JSX.Element {
  const slateEditor = useMemo(() => withReact(createEditor()), []);
  const editorAPI = useMemo(() => new EditorAPI(slateEditor), [slateEditor]);
  const [_editorState, dispatch] = useReducer(reduce, { selectionRef: null });
  // const [selection, setSelection] = useState(editorAPI.getSelection());

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editorAPI, event),
    [editorAPI]
  );

  const [previousSelection, selection, setSelection] = useSelection(
    slateEditor
  );

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(slateEditor.selection);
    },
    [onChange, setSelection, slateEditor]
  );

  return (
    <EditorDispatchContext.Provider value={dispatch}>
      <EditorAPIContext.Provider value={editorAPI}>
        <Slate editor={slateEditor} value={document} onChange={onChangeLocal}>
          <Toolbar
            selection={selection}
            previousSelection={previousSelection}
          />
          <div className="editor">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
            />
          </div>
        </Slate>
      </EditorAPIContext.Provider>
    </EditorDispatchContext.Provider>
  );
}

export default Editor;
