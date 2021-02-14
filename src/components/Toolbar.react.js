import "./Toolbar.css";

import { EditorAPIContext } from "./Editor.react";
import classNames from "classnames";
import { useContext } from "react";

export default function Toolbar() {
  return (
    <div>
      {["bold", "italic", "underline", "code"].map((style) => (
        <ToolBarButton key={style} style={style} label={style}></ToolBarButton>
      ))}
    </div>
  );
}

function ToolBarButton({ style, label }) {
  const api = useContext(EditorAPIContext);
  const isActive = api.getActiveStyles().has(style);

  return (
    <div
      role="button"
      onMouseDown={(event) => {
        event.preventDefault();
        api.toggleStyle(style);
      }}
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
