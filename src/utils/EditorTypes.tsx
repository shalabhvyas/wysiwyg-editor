import type { Element } from "slate";

export type DocumentComponent =
  | {
      type: "rich-text";
      children: Element;
    }
  | {
      type: "image";
      url: string;
      caption: string;
    };

export type DocumentStructure = {
  content: DocumentComponent[];
};
