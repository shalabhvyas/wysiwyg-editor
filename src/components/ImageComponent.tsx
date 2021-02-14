import { DocumentStructure, RichTextComponent } from "../EditorTypes";
import {
  Editable,
  Slate,
  withReact,
  useFocused,
  useSelected,
} from "slate-react";
import { useCallback, useMemo } from "react";
import type { Node } from "slate";
import type { RenderElementProps } from "slate-react";
import React from "react";
import { createEditor } from "slate";
import { DefaultElement } from "slate-react";

const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img src={String(element.url)} />
      </div>
      {children}
    </div>
  );
};

export default ImageElement;
