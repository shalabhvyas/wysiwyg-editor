import "./Link.css";

export default function Link({ element, attributes, children }) {
  return (
    <a href={element.url} {...attributes} className={"link"}>
      {children}
    </a>
  );
}
