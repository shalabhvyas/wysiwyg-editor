import "./Toolbar.css";

import { useCallback, useContext } from "react";

import { EditorAPIContext } from "./Editor.react";
import classNames from "classnames";

export default function Toolbar() {
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
