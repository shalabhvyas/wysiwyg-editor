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
          "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg",
        caption: "Cute Puppy",
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
