import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import EditorAPI, { renderElement, renderLeaf } from "../utils/EditorAPI";
import { KeyBindings, isLinkNodeAtSelection } from "../utils/EditorAPI";
import { Node, Editor as SlateEditor, Transforms, createEditor } from "slate";
import { useCallback, useMemo, useRef } from "react";

import LinkEditor from "./LinkEditor.react";
import React from "react";
import Toolbar from "./Toolbar.react";
import useSelection from "../hooks/useSelection";

export const EditorAPIContext = React.createContext(null);
export const EditorDispatchContext = React.createContext(null);

// A hack that needs to be applied to prevent selection from getting reset if some
// input element outside takes focus. https://github.com/ianstormtaylor/slate/issues/3412
Transforms.deselect = () => {};

function Editor({ document, onChange }): JSX.Element {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const editorAPI = useMemo(() => new EditorAPI(editor), [editor]);

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editorAPI, event),
    [editorAPI]
  );

  const [previousSelection, selection, setSelection] = useSelection(editor);

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);

      const [leaf, _] = SlateEditor.leaf(editor, editor.selection, {
        edge: "end",
      });
      console.log(Node.string(leaf));
      // use history object to detect space insertion
      // and then use Node.string and try to run a regex match on it.
      // and then Editor.deleteBackward to delete the word and replace with link OR
      // do Transforms.setSelection to the link and then Transforms.wrapNodes.
      // Try to use code from mentions - https://github.com/ianstormtaylor/slate/blob/master/site/examples/mentions.tsx#L80
    },
    [onChange, setSelection, editor]
  );

  return (
    <EditorAPIContext.Provider value={editorAPI}>
      <Slate editor={editor} value={document} onChange={onChangeLocal}>
        <Toolbar selection={selection} previousSelection={previousSelection} />
        <div className="editor" ref={editorRef}>
          {isLinkNodeAtSelection(editor, selection) ? (
            <LinkEditor
              editorOffsets={
                editorRef.current != null
                  ? {
                      x: editorRef.current.getBoundingClientRect().x,
                      y: editorRef.current.getBoundingClientRect().y,
                    }
                  : null
              }
            />
          ) : null}
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
