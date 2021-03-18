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
import Toolbar from "./Toolbar";
import { activeCommentThreadIDAtom } from "../utils/CommentState";
import { createEditor } from "slate";
import { isCommentAtSelection } from "../utils/EditorCommentUtils";
import useEditorConfig from "../hooks/useEditorConfig";
import { useRecoilState } from "recoil";
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
  const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(
    activeCommentThreadIDAtom
  );

  // we update selection here because Slate fires an onChange even on pure selection change.
  const onChangeLocal = useCallback(
    (doc) => {
      onChange(doc);
      setSelection(editor.selection);
      identifyLinksInTextIfAny(editor);

      if (!isCommentAtSelection(editor)) {
        setActiveCommentThreadID(null);
      }
    },
    [onChange, setSelection, editor, setActiveCommentThreadID]
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

  let selectionForActiveComment = null;
  if (isCommentAtSelection(editor, selection)) {
    selectionForActiveComment = selection;
  } else if (
    selection == null &&
    isCommentAtSelection(editor, previousSelection)
  ) {
    selectionForActiveComment = previousSelection;
  }

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
            <div className="editor" ref={editorRef}>
              {selectionForLink != null ? (
                <LinkEditor
                  editorOffsets={editorOffsets}
                  selectionForLink={selectionForLink}
                />
              ) : null}
              {activeCommentThreadID != null &&
              selectionForActiveComment != null ? (
                <CommentThreadPopover
                  editorOffsets={editorOffsets}
                  threadID={activeCommentThreadID}
                  selectionForActiveComment={selectionForActiveComment}
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
    </Slate>
  );
}

export default Editor;
