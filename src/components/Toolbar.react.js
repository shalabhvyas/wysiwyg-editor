import "./Toolbar.css";

import { Editor, Transforms } from "slate";
import { useCallback, useContext } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { EditorAPIContext } from "./Editor.react";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { useEditor } from "slate-react";
import { v4 as uuidv4 } from "uuid";

export default function Toolbar({ selection, previousSelection }) {
  const editor = useEditor();
  const api = useContext(EditorAPIContext);

  const onBlockTypeChange = useCallback(
    (targetType) => {
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
    <Row>
      <Col xs={12} md={8}>
        <DropdownButton
          className={"block-style-dropdown"}
          id="block-style"
          title={getLabelForBlockStyle(api.getBlockType() ?? "paragraph")}
          onSelect={onBlockTypeChange}
        >
          {["h1", "h2", "paragraph", "multiple"].map((blockType) => (
            <Dropdown.Item eventKey={blockType} key={blockType}>
              {getLabelForBlockStyle(blockType)}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        {["bold", "italic", "underline", "code"].map((style) => (
          <ToolBarStyleButton
            key={style}
            style={style}
            icon={<i className={`bi ${getIconForButton(style)}`} />}
          />
        ))}
      </Col>
      <Col xs={12} md={4} className="toobar-right-panel">
        <ToolBarButton
          isActive={api.hasActiveLinkAtSelection()}
          label={<i className={`bi ${getIconForButton("link")}`} />}
          onMouseDown={() => api.toggleLinkAtSelection()}
        />
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
                onChange={onImageUploaded}
              />
            </>
          }
        />
      </Col>
    </Row>
  );
}

function ToolBarStyleButton({ as, style, icon }) {
  const api = useContext(EditorAPIContext);

  return (
    <ToolBarButton
      as={as}
      onMouseDown={(event) => {
        event.preventDefault();
        api.toggleStyle(style);
      }}
      isActive={api.getActiveStyles().has(style)}
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
      return "";
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
      return "";
  }
}
