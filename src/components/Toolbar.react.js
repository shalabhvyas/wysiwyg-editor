import "./Toolbar.css";

import { useCallback, useContext } from "react";

import { EditorAPIContext } from "./Editor.react";
import { Transforms } from "slate";
import classNames from "classnames";
import { useEditor } from "slate-react";

export default function Toolbar({ previousSelection }) {
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

      Transforms.insertNodes(
        editor,
        {
          type: "image",
          caption: files[0].name,
          url: "https://via.placeholder.com/150",
          children: [{ text: "" }],
        },
        { at: previousSelection, select: true }
      );
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
