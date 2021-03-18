import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../utils/EditorUtils";
import { useCallback, useMemo, useRef } from "react";

import Col from "react-bootstrap/Col";
import CommentThreadPopover from "./CommentThreadPopover";
import Container from "react-bootstrap/Container";
import LinkEditor from "./LinkEditor";
import React from "react";
import Row from "react-bootstrap/Row";
import { SetActiveCommentThreadIDContext } from "../utils/CommentState";
import Toolbar from "./Toolbar";
import { createEditor } from "slate";
import useActiveCommentThread from "../hooks/useActiveCommentThread";
import useEditorConfig from "../hooks/useEditorConfig";
import useSelection from "../hooks/useSelection";

function Editor({ document, onChange }): JSX.Element {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderLeaf, renderElement, KeyBindings } = useEditorConfig(editor);

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [KeyBindings, editor]
  );

  const [previousSelection, selection, setSelection] = useSelection(editor);

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);
      identifyLinksInTextIfAny(editor);
    },
    [onChange, setSelection, editor]
  );

  let selectionForLink = null;
  if (isLinkNodeAtSelection(editor, selection)) {
    selectionForLink = selection;
  } else if (
    selection == null &&
    isLinkNodeAtSelection(editor, previousSelection)
  ) {
    selectionForLink = previousSelection;
  }

  const [
    commentTextNode,
    setActiveCommentThreadIDCallback,
  ] = useActiveCommentThread();

  const editorOffsets =
    editorRef.current != null
      ? {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      : null;

  return (
    <Slate editor={editor} value={document} onChange={onChangeLocal}>
      <Container className={"editor-container"}>
        <Row>
          <Col>
            <Toolbar
              selection={selection}
              previousSelection={previousSelection}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SetActiveCommentThreadIDContext.Provider
              value={setActiveCommentThreadIDCallback}
            >
              <div className="editor" ref={editorRef}>
                {selectionForLink != null ? (
                  <LinkEditor
                    editorOffsets={editorOffsets}
                    selectionForLink={selectionForLink}
                  />
                ) : null}
                {commentTextNode != null ? (
                  <CommentThreadPopover
                    editorOffsets={editorOffsets}
                    textNode={commentTextNode}
                  />
                ) : null}
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={onKeyDown}
                />
              </div>
            </SetActiveCommentThreadIDContext.Provider>
          </Col>
        </Row>
      </Container>
    </Slate>
  );
}

export default Editor;
