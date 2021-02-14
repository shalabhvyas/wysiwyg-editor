import "./App.css";

import { useMemo, useState } from "react";

import { DocumentStructure } from "./EditorTypes";
import Editor from "./Editor";
import React from "react";

function App() {
  const [document, updateDocument] = useState<DocumentStructure>({
    content: [
      {
        type: "rich-text",
        children: [
          {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
          },
        ],
      },
      {
        type: "image",
        url:
          "https://www.google.com/logos/doodles/2021/valentines-day-2021-6753651837108860.3-law.gif",
        children: [{ text: "" }],
      },
    ],
  });

  return (
    <div className="App">
      <Editor document={document} onChange={updateDocument} />
    </div>
  );
}

export default App;
