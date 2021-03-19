import "./Editor.css";

import { Editable, Slate, withReact } from "slate-react";
import React, { useEffect } from "react";
import {
  activeCommentThreadIDAtom,
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";
import {
  identifyLinksInTextIfAny,
  isLinkNodeAtSelection,
} from "../utils/EditorUtils";
import {
  initializeStateWithAllCommentThreads,
  isCommentAtSelection,
} from "../utils/EditorCommentUtils";
import { useCallback, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

import Col from "react-bootstrap/Col";
import CommentThreadPopover from "./CommentThreadPopover";
import CommentsSidebar from "./CommentsSidebar";
import Container from "react-bootstrap/Container";
import LinkEditor from "./LinkEditor";
import Row from "react-bootstrap/Row";
import Toolbar from "./Toolbar";
import { createEditor } from "slate";
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
  const activeCommentThreadID = useRecoilValue(activeCommentThreadIDAtom);
  const setCommentThreadData = useRecoilCallback(
    ({ set }) => (id, threadData) => {
      set(commentThreadIDsState, (ids) => new Set([...Array.from(ids), id]));
      set(commentThreadsState(id), threadData);
    },
    []
  );

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

  let selectionForCommentPopover = null;
  if (isCommentAtSelection(editor, selection)) {
    selectionForCommentPopover = selection;
  } else if (
    selection == null &&
    isCommentAtSelection(editor, previousSelection)
  ) {
    selectionForCommentPopover = previousSelection;
  }

  const editorOffsets =
    editorRef.current != null
      ? {
          x: editorRef.current.getBoundingClientRect().x,
          y: editorRef.current.getBoundingClientRect().y,
        }
      : null;

  useEffect(() => {
    initializeStateWithAllCommentThreads(editor, setCommentThreadData);
  }, [editor, setCommentThreadData]);

  return (
    <Slate editor={editor} value={document} onChange={onChangeLocal}>
      <Container className={"editor-wrapper"} fluid>
        <Row>
          <Col>
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
                    {activeCommentThreadID != null &&
                    selectionForCommentPopover != null ? (
                      <CommentThreadPopover
                        editorOffsets={editorOffsets}
                        threadID={activeCommentThreadID}
                        selectionForCommentPopover={selectionForCommentPopover}
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
          </Col>
          <Col className={"sidebar-wrapper"}>
            <Container>
              <CommentsSidebar />
            </Container>
          </Col>
        </Row>
      </Container>
    </Slate>
  );
}

export default Editor;
