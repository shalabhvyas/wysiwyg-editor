import "./App.css";

import { RecoilRoot, useRecoilSnapshot } from "recoil";
import { useEffect, useState } from "react";

import Editor from "./components/Editor";
import ExampleDocument from "./utils/ExampleDocument";
import Navbar from "react-bootstrap/Navbar";
import React from "react";

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
          <DebugObserver />
        </RecoilRoot>
      </div>
    </>
  );
}

function DebugObserver(): React.Node {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug("The following atoms were modified:");
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

export default App;
