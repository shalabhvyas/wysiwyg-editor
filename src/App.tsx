import "./App.css";

import { Editable, Slate, withReact } from "slate-react";
import React, { useMemo, useState } from "react";
import type { Node } from "slate";
import { createEditor } from "slate";

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);
  return (
    <div className="App">
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Editable />
      </Slate>
    </div>
  );
}

export default App;
