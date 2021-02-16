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
        {/* you can make the caption editable using an `input` element since the 
        parent itself has content editable false. */}
        <div style={{ textAlign: "center" }}>{element.caption}</div>
      </div>
      {children}
    </div>
  );
};

export default Image;
