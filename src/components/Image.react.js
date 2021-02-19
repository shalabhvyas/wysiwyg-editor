import "./Image.css";

import { Editor, Transforms } from "slate";
import React, { useCallback, useState } from "react";
import { useEditor, useFocused, useSelected } from "slate-react";

import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

const Image = ({ attributes, children, element }) => {
  const [isEditingCaption, setEditingCaption] = useState(false);
  const editor = useEditor();

  const selected = useSelected();
  const focused = useFocused();

  const onCaptionChange = useCallback(
    (event) => {
      const imageNodeEntry = Editor.above(editor, {
        match: (n) => n.type === "image",
      });
      if (imageNodeEntry == null) {
        return;
      }
      Transforms.setNodes(
        editor,
        { caption: event.target.value },
        { at: imageNodeEntry[1] }
      );
    },
    [editor]
  );

  const onToggleCaptionEditMode = useCallback(
    () => setEditingCaption(!isEditingCaption),
    [setEditingCaption, isEditingCaption]
  );

  return (
    <>
      <div
        {...attributes}
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
            size="sm"
            type="text"
            defaultValue={element.caption}
            onCHange={onCaptionChange}
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
    </>
  );
};

export default Image;
