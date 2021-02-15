export function convertToSlate(doc) {
  return doc.content.map((node) => {
    switch (node.type) {
      case "paragraph":
      case "h1":
      case "h2":
        return node;
      case "image":
        return {
          ...node,
          // Slate specific hack that requires void nodes to have a text leaf.
          children: [{ text: "" }],
        };
      default:
        throw new Error(`Unhandled node type: ${node.type}`);
    }
  });
}

export function convertFromSlate(nodes) {
  return {
    content: nodes.map((node: Node) => {
      switch (node.type) {
        case "paragraph":
        case "h1":
        case "h2":
          return {
            id: node.id,
            type: node.type,
            children: node.children,
          };
        case "image":
          return {
            id: node.id,
            type: "image",
            url: String(node.url),
            caption: String(node.caption),
          };
        default:
          throw new Error(`Unhandled node type: ${node.type}`);
      }
    }),
  };
}
