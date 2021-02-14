import type { RenderElementProps } from "slate-react";
import React from "react";

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
