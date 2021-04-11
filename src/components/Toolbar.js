import "./Toolbar.css";

import {
  getActiveStyles,
  getTextBlockStyle,
  hasActiveLinkAtSelection,
  toggleBlockType,
  toggleLinkAtSelection,
  toggleStyle,
} from "../utils/EditorUtils";

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useCallback } from "react";
import { useEditor } from "slate-react";
import useImageUploadHandler from "../hooks/useImageUploadHandler";

const PARAGRAPH_STYLES = ["h1", "h2", "h3", "h4", "paragraph", "multiple"];
const CHARACTER_STYLES = ["bold", "italic", "underline", "code"];

export default function Toolbar({ selection, previousSelection }) {
  const editor = useEditor();

  const onBlockTypeChange = useCallback(
    (targetType) => {
      if (targetType === "multiple") {
        return;
      }
      toggleBlockType(editor, targetType);
    },
    [editor]
  );

  const onImageSelected = useImageUploadHandler(editor, previousSelection);

  const blockType = getTextBlockStyle(editor);

  return (
    <div className="toolbar">
      {/* Dropdown for paragraph styles */}
      <DropdownButton
        className={"block-style-dropdown"}
        disabled={blockType == null || blockType === ""}
        id="block-style"
        title={getLabelForBlockStyle(blockType ?? "paragraph")}
        onSelect={onBlockTypeChange}
      >
        {PARAGRAPH_STYLES.map((blockType) => (
          <Dropdown.Item eventKey={blockType} key={blockType}>
            {getLabelForBlockStyle(blockType)}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      {/* Buttons for character styles */}
      {CHARACTER_STYLES.map((style) => (
        <ToolBarStyleButton
          key={style}
          style={style}
          icon={<i className={`bi ${getIconForButton(style)}`} />}
        />
      ))}
      {/* Link Button */}
      <ToolBarButton
        isActive={hasActiveLinkAtSelection(editor)}
        label={<i className={`bi ${getIconForButton("link")}`} />}
        onMouseDown={() => toggleLinkAtSelection(editor)}
      />
      {/* Image Upload Button */}
      <ToolBarButton
        isActive={false}
        as={"label"}
        htmlFor="image-upload"
        label={
          <>
            <i className={`bi ${getIconForButton("image")}`} />
            <input
              type="file"
              id="image-upload"
              className="image-upload-input"
              accept="image/png, image/jpeg"
              onChange={onImageSelected}
            />
          </>
        }
      />
    </div>
  );
}

function ToolBarStyleButton({ as, style, icon }) {
  const editor = useEditor();
  return (
    <ToolBarButton
      as={as}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleStyle(editor, style);
      }}
      isActive={getActiveStyles(editor).has(style)}
      label={icon}
    />
  );
}

function ToolBarButton(props) {
  const { label, isActive, ...otherProps } = props;
  return (
    <Button
      variant="outline-primary"
      className="toolbar-btn"
      active={isActive}
      {...otherProps}
    >
      {label}
    </Button>
  );
}

function getIconForButton(style) {
  switch (style) {
    case "bold":
      return "bi-type-bold";
    case "italic":
      return "bi-type-italic";
    case "code":
      return "bi-code-slash";
    case "underline":
      return "bi-type-underline";
    case "image":
      return "bi-file-image";
    case "link":
      return "bi-link-45deg";
    default:
      throw new Error(`Unhandled style in getIconForButton: ${style}`);
  }
}

function getLabelForBlockStyle(style) {
  switch (style) {
    case "h1":
      return "Heading 1";
    case "h2":
      return "Heading 2";
    case "h3":
      return "Heading 3";
    case "h4":
      return "Heading 4";
    case "paragraph":
      return "Paragraph";
    case "multiple":
      return "Multiple";
    default:
      throw new Error(`Unhandled style in getLabelForBlockStyle: ${style}`);
  }
}
