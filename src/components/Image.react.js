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

  return (
    // void elements need to be content editable false, explain that part.
    <div contentEditable={false} {...attributes}>
      <div
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
      {/* Void blocks in general, always have an empty text node to have a point to select to.This is children here. 
      And that is why we have to have an empty text ''  node at the end*/}
      {children}
    </div>
  );
};

export default Image;
