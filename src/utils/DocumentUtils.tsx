import { DocumentStructure } from "./EditorTypes";
import type { Node } from "slate";
export function convertToSlate(doc: DocumentStructure): Node[] {
  return doc.content.map((node) => {
    switch (node.type) {
      case "rich-text":
        return node;
      case "image":
        return {
          type: "image",
          url: node.url,
          // Slate specific hack that requires void nodes to have a text leaf.
          children: [{ text: "" }],
        };
      default:
        throw "Unhandled node type";
    }
  });
}

export function convertFromSlate(nodes: Node[]): DocumentStructure {
  return {
    content: nodes.map((node: Node) => {
      switch (node.type) {
        case "rich-text":
          return {
            type: "rich-text",
            children: node.children != null ? Array.from(node.children) : [],
          };
        case "image":
          return {
            type: "image",
            url: String(node.url),
            caption: String(node.caption),
          };
        default:
          throw "Unhandled node type";
      }
    }),
  };
}
