import type { Node } from "slate";

export type RichTextComponent = Node[];
export type DocumentComponent =
  | {
      type: "rich-text";
      children: RichTextComponent;
    }
  | {
      type: "image";
      url: string;
      children?: Array<Node>;
    };

export type DocumentStructure = {
  content: Node[];
};
