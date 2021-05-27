import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import React, { useEffect } from "react";
import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../utils/EditorUtils";
import { useCallback, useMemo, useRef } from "react";

import Col from "react-bootstrap/Col";
import CommentThreadPopover from "./CommentThreadPopover";
import CommentsSidebar from "./CommentsSidebar";
import Container from "react-bootstrap/Container";
import LinkEditor from "./LinkEditor";
import Row from "react-bootstrap/Row";
import Toolbar from "./Toolbar";
import { activeCommentThreadIDAtom } from "../utils/CommentState";
import { createEditor } from "slate";
import { initializeStateWithAllCommentThreads } from "../utils/EditorCommentUtils";
import useAddCommentThreadCallback from "../hooks/useAddCommentThreadCallback";
import useEditorConfig from "../hooks/useEditorConfig";
import { useRecoilValue } from "recoil";
import useSelection from "../hooks/useSelection";

export default function Editor({ document, onChange }) {
  const editorRef = useRef(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderLeaf, renderElement, KeyBindings } = useEditorConfig(editor);

  const onKeyDown = useCallback(
    (event) => KeyBindings.onKeyDown(editor, event),
    [KeyBindings, editor]
  );

  const [previousSelection, selection, setSelection] = useSelection(editor);
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  const addCommentThread = useAddCommentThreadCallback();

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

  const editorOffsets =
    editorRef.current != null
      ? {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      : null;

  useEffect(() => {
    initializeStateWithAllCommentThreads(editor, addCommentThread);
  }, [editor, addCommentThread]);

  return (
    <Slate editor={editor} value={document} onChange={onChangeLocal}>
      <div className={"editor-wrapper"} fluid={"true"}>
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
              <div className="editor" ref={editorRef}>
                {selectionForLink != null ? (
                  <LinkEditor
                    editorOffsets={editorOffsets}
                    selectionForLink={selectionForLink}
                  />
                ) : null}
                {activeCommentThreadID != null ? (
                  <CommentThreadPopover
                    editorOffsets={editorOffsets}
                    threadID={activeCommentThreadID}
                    selection={selection ?? previousSelection}
                  />
                ) : null}
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={onKeyDown}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <div className={"sidebar-wrapper"}>
          <CommentsSidebar />
        </div>
      </div>
    </Slate>
  );
}
