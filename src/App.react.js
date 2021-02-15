import "./App.css";

import Editor from "./components/Editor.react";
import React from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function App() {
  const [document, updateDocument] = useState({
    content: [
      {
        type: "h1",
        children: [{ text: "Heading H1" }],
      },
      {
        type: "h2",
        children: [{ text: "Heading H2" }],
      },
      {
        type: "paragraph",
        children: [
          { text: "A line of text in a paragraph." },
          { text: " Rich", bold: true },
          { text: " text, " },
          { text: "much", italic: true },
          { text: " better than a " },
          { text: "<textarea>", code: true },
        ],
      },
      {
        id: uuid(),
        type: "image",
        url:
          "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg",
        caption: "Cute Puppy",
      },
      {
        type: "paragraph",
        children: [{ text: "dfjlsdfsdf" }],
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
