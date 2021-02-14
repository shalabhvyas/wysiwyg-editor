import React from "react";

export default function StyledText({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}
