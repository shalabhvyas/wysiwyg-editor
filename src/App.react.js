import "./App.css";

import Editor from "./components/Editor.react";
import React from "react";
import { useState } from "react";

function App() {
  const [document, updateDocument] = useState({
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
        caption: "Image caption",
      },
      {
        type: "rich-text",
        children: [
          {
            type: "paragraph",
            children: [{ text: "dfjlsdfsdf" }],
          },
        ],
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
