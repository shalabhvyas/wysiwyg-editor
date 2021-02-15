import "./Toolbar.css";

import { EditorAPIContext } from "./Editor.react";
import classNames from "classnames";
import { useContext } from "react";

export default function Toolbar() {
  return (
    <div>
      {["bold", "italic", "underline", "code"].map((style) => (
        <ToolBarStyleButton key={style} style={style} label={style} />
      ))}
      {["h1", "h2", "p"].map((blockType) => (
        <ToolBarBlockButton
          key={blockType}
          blockType={blockType}
          label={blockType}
        />
      ))}
    </div>
  );
}

function ToolBarBlockButton({ blockType, label }) {
  const api = useContext(EditorAPIContext);

  return (
    <ToolBarButton
      role="button"
      onMouseDown={(event) => {
        event.preventDefault();
        api.toggleBlockType(blockType);
      }}
      isActive={api.getBlockType() === blockType}
      label={label}
    />
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
