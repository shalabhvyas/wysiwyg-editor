import "./Image.css";

import { Editor, Transforms } from "slate";
import React, { useCallback, useState } from "react";

import { useEditor } from "slate-react";

const Image = ({ attributes, children, element }) => {
  const [isEditingCaption, setEditingCaption] = useState(false);
  const editor = useEditor();

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
    <div {...attributes} contentEditable={false} className="image-container">
      <img
        src={String(element.url)}
        alt={element.caption}
        className={"image"}
      />
      {isEditingCaption ? (
        <textarea
          type="text"
          value={element.caption}
          className={"image-caption-input"}
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
      {children}
    </div>
  );
};

export default Image;
