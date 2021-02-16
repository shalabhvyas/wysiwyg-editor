import { EditorAPIContext } from "../components/Editor.react";
import { useContext } from "react";
export default function useEditorAPI() {
  return useContext(EditorAPIContext);
}
