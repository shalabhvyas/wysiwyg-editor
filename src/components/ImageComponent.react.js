import React from "react";
import type { RenderElementProps } from "slate-react";

const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img src={String(element.url)} alt={element.caption} />
        <span>{element.caption}</span>
      </div>
      {children}
    </div>
  );
};

export default ImageElement;
