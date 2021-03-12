import "./App.css";

import { RecoilRoot, atom } from "recoil";

import Editor from "./components/Editor";
import ExampleDocument from "./utils/ExampleDocument";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { useState } from "react";

const commentsState = atom({
  key: "commentsState",
  default: new Map([
    ["thread_1", ["comment 1 1", "comment 1 2"]],
    ["thread_1", ["comment 2 1", "comment 2 2"]],
  ]),
});

function App() {
  const [document, updateDocument] = useState(ExampleDocument);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#">
          <img
            alt=""
            src="/app-icon.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          WYSIWYG Editor
        </Navbar.Brand>
      </Navbar>
      <div className="App">
        <RecoilRoot>
          <Editor document={document} onChange={updateDocument} />
        </RecoilRoot>
      </div>
    </>
  );
}

export default App;
