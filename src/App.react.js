import "./App.css";

import Editor from "./components/Editor.react";
import React from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function App() {
  const [document, updateDocument] = useState([
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
        {
          type: "link",
          url: "https://www.google.com",
          children: [
            { text: "Text inside link." },
            { text: "Bold text inside link.", bold: true },
          ],
        },
        { text: "much", italic: true },
        { text: " better than a " },
        { text: "<textarea>", code: true },
      ],
    },
    {
      id: uuid(),
      type: "image",
      url: "/photos/biwi.jpg",
      caption: "Beauty",
      children: [{ text: "" }],
    },
    {
      type: "paragraph",
      children: [{ text: "dfjlsdfsdf" }],
    },
  ]);

  return (
    <div className="App">
      <Editor document={document} onChange={updateDocument} />
    </div>
  );
}

export default App;
