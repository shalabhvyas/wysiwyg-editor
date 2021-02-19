import "./Image.css";

import { Editor, Transforms } from "slate";
import React, { useCallback, useState } from "react";
import { useEditor, useFocused, useSelected } from "slate-react";

import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";
import isHotkey from "is-hotkey";

const Image = ({ attributes, children, element }) => {
  const [isEditingCaption, setEditingCaption] = useState(false);
  const editor = useEditor();

  const selected = useSelected();
  const focused = useFocused();

  const changeCaption = useCallback(
    (caption) => {
      const imageNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "image",
      });
      if (imageNodeEntry == null) {
        return;
      }
      Transforms.setNodes(editor, { caption }, { at: imageNodeEntry[1] });
    },
    [editor]
  );

  const onCaptionChange = useCallback(
    (event) => {
      changeCaption(event.target.value);
    },
    [changeCaption]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (!isHotkey("enter", event)) {
        return;
      }
      changeCaption(event.target.value);
      setEditingCaption(false);
    },
    [changeCaption]
  );

  const onToggleCaptionEditMode = useCallback(
    (event) => {
      setEditingCaption(!isEditingCaption);
    },
    [setEditingCaption, isEditingCaption]
  );

  // Talk about how Slate breaks if you don't have things in a certain way
  // when rendering void elements. Rules are -
  // Topmost element should have the slate attributes.
  // contentEditable={false} should be a child of that with the contents of the void element
  // children should be rendered outside the content editable.
  return (
    <div {...attributes}>
      <div
        contentEditable={false}
        className={classNames({
          "image-container": true,
          "is-selected": selected && focused,
        })}
      >
        {!element.isUploading && element.url != null ? (
          <img
            src={String(element.url)}
            alt={element.caption}
            className={"image"}
          />
        ) : (
          <div className={"image-upload-placeholder"}>
            <Spinner animation="grow" />
          </div>
        )}
        {isEditingCaption ? (
          <Form.Control
            className={"image-caption-input"}
            size="sm"
            type="text"
            defaultValue={element.caption}
            onKeyDown={onKeyDown}
            onChange={onCaptionChange}
            onBlur={onToggleCaptionEditMode}
          />
        ) : (
          <div
            className={"image-caption-read-mode"}
            onClick={onToggleCaptionEditMode}
          >
            {element.caption}
          </div>
        )}
      </div>
      {/* Talk about why void elements still need to render children and why children need to be rendered outside
      content editable. */}
      {children}
    </div>
  );
};

export default Image;
