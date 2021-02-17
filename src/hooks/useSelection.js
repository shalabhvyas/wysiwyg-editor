import { useCallback, useEffect, useRef, useState } from "react";

export default function useSelection(editor) {
  const [selection, setSelection] = useState(editor.selection);
  const previousSelection = useRef(null);
  const setSelectionOptimized = useCallback(
    (selection) => {
      setSelection(selection);
    },
    [setSelection]
  );

  useEffect(() => {
    previousSelection.current = selection;
  });

  return [previousSelection.current, selection, setSelectionOptimized];
}
