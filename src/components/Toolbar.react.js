import "./Toolbar.css";

import { Editor, Transforms } from "slate";
import { useCallback, useContext } from "react";

import { EditorAPIContext } from "./Editor.react";
import axios from "axios";
import classNames from "classnames";
import { useEditor } from "slate-react";
import { v4 as uuidv4 } from "uuid";

export default function Toolbar({ selection, previousSelection }) {
  const editor = useEditor();
  const api = useContext(EditorAPIContext);

  const onBlockTypeChange = useCallback(
    (event) => {
      const targetType = event.target.value;
      if (targetType === "multiple") {
        return;
      }
      api.toggleBlockType(targetType);
    },
    [api]
  );

  const onImageUploaded = useCallback(
    (event) => {
      event.preventDefault();
      const files = event.target.files;
      if (files.length === 0) {
        return;
      }
      const fileName = files[0].name;
      const formData = new FormData();
      formData.append("photo", files[0]);

      const id = uuidv4();

      Transforms.insertNodes(
        editor,
        {
          id,
          type: "image",
          caption: fileName,
          url: null,
          isUploading: true,
          children: [{ text: "" }],
        },
        // Talk about why we need previousSelection here - https://github.com/ianstormtaylor/slate/issues/3412#issuecomment-574831587
        { at: previousSelection, select: true }
      );

      axios
        .post("/upload", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          setTimeout(() => {
            const newImageEntry = Editor.nodes(editor, {
              match: (n) => n.id === id,
            });

            if (newImageEntry == null) {
              return;
            }

            Transforms.setNodes(
              editor,
              { isUploading: false, url: `/photos/${fileName}` },
              { at: newImageEntry[1] }
            );
          }, 3000);
        })
        .catch((error) => {});
    },
    [editor, previousSelection]
  );

  return (
    <div>
      {["bold", "italic", "underline", "code"].map((style) => (
        <ToolBarStyleButton key={style} style={style} label={style} />
      ))}
      <select
        id="block-type"
        onChange={onBlockTypeChange}
        value={api.getBlockType() ?? "paragraph"}
      >
        {["h1", "h2", "paragraph", "multiple"].map((blockType) => (
          <option value={blockType} key={blockType} label={blockType} />
        ))}
      </select>
      <ToolBarButton
        role="button"
        isActive={api.hasActiveLinkAtSelection()}
        label={"Link"}
        onMouseDown={() => api.toggleLinkAtSelection()}
      />
      <ToolBarButton
        role="button"
        isActive={false}
        label={
          <>
            <label htmlFor="image-upload">{"Upload Image"}</label>
            <input
              type="file"
              id="image-upload"
              className="image-upload-input"
              accept="image/png, image/jpeg"
              onChange={onImageUploaded}
            />
          </>
        }
      />
    </div>
  );
}

function ToolBarStyleButton({ style, label }) {
  const api = useContext(EditorAPIContext);

  return (
    <ToolBarButton
      role="button"
      onMouseDown={(event) => {
        event.preventDefault();
        api.toggleStyle(style);
      }}
      isActive={api.getActiveStyles().has(style)}
      label={label}
    />
  );
}

function ToolBarButton(props) {
  const { label, isActive, ...otherProps } = props;
  return (
    <div
      role="button"
      {...otherProps}
      className={classNames({
        "toolbar-btn": true,
        "is-active": isActive,
      })}
      aria-pressed={isActive + ""}
    >
      {label}
    </div>
  );
}
