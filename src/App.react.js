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
            { text: "Bold text inside link." },
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
      url:
        "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg",
      caption: "Cute Puppy",
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

// const [document, updateDocument] = useState(
//     Value.fromJSON({
//       document: {
//         nodes: [
//           {
//             object: "block",
//             type: "h1",
//             children: [{ object: "text", text: "Heading H1" }],
//           },
//           {
//             object: "block",
//             type: "h2",
//             children: [{ object: "text", text: "Heading H2" }],
//           },
//           {
//             object: "block",
//             type: "paragraph",
//             children: [
//               { object: "text", text: "A line of text in a paragraph." },
//               { object: "text", text: " Rich", bold: true },
//               { object: "text", text: " text, " },
//               {
//                 type: "link",
//                 url: "https://www.google.com",
//                 children: [
//                   { object: "text", text: "Text inside link." },
//                   { object: "text", text: "Bold text inside link." },
//                 ],
//               },
//               { object: "text", text: "much", italic: true },
//               { object: "text", text: " better than a " },
//               { object: "text", text: "<textarea>", code: true },
//             ],
//           },
//           {
//             object: "block",
//             type: "image",
//             url:
//               "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_1280.jpg",
//             caption: "Cute Puppy",
//           },
//           {
//             object: "block",
//             type: "paragraph",
//             children: [{ object: "text", text: "dfjlsdfsdf" }],
//           },
//         ],
//       },
//     })
//   );
