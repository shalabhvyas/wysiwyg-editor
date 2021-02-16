import { EditorAPIContext } from "./Editor.react";
import LinkEditor from "./LinkEditor.react";
import { useContext } from "react";

const selectionMenuSupportedNodeTypes = ["link"];

export default function EditorSelectionMenu(context) {
  const editorAPI = useContext(EditorAPIContext);
  const selection = editorAPI.getSelection();
  if (selection == null) {
    return null;
  }

  let nodeType = null,
    domNode = null,
    path = null;

  const [currentNode, currentPath] = editorAPI.getNode(selection);
  if (selectionMenuSupportedNodeTypes.includes(currentNode.type ?? null)) {
    nodeType = currentNode.type;
    domNode = editorAPI.getDOMNode(currentNode);
    path = currentPath;
  } else {
    const [parent, parentPath] = editorAPI.getParent(selection);
    if (selectionMenuSupportedNodeTypes.includes(parent?.type)) {
      nodeType = parent.type;
      domNode = editorAPI.getDOMNode(currentNode);
      path = parentPath;
    }
  }

  if (nodeType == null) {
    return null;
  }

  let menu = null;

  switch (nodeType) {
    case "link":
      menu = <LinkEditor node={domNode} path={path} />;
      break;
    default:
      menu = null;
  }

  return <>{menu}</>;
}
