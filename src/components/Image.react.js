import "./Image.css";

import React from "react";

const Image = ({ attributes, children, element }) => {
  return (
    <div {...attributes} className="image-container">
      <div contentEditable={false}>
        <img
          src={String(element.url)}
          alt={element.caption}
          className={"image"}
        />
        <div style={{ textAlign: "center" }}>{element.caption}</div>
      </div>
      {children}
    </div>
  );
};

export default Image;
