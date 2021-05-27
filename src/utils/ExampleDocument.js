import { getMarkForCommentThreadID } from "./EditorCommentUtils";
import { v4 as uuid } from "uuid";

const overlappingCommentThreadID = uuid();

const ExampleDocument = [
  {
    type: "h1",
    children: [{ text: "Document Title (Heading H1)" }],
  },
  {
    type: "h2",
    children: [{ text: "Subtitle (Heading H2)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Text 1",
        [getMarkForCommentThreadID(uuid())]: true,
      },
      {
        text: "Text 2",
        [getMarkForCommentThreadID(overlappingCommentThreadID)]: true,
      },
      {
        text: "Text 3",
        bold: true,
        [getMarkForCommentThreadID(overlappingCommentThreadID)]: true,
        [getMarkForCommentThreadID(uuid())]: true,
      },
      {
        text: "Text 4",
        bold: true,
        [getMarkForCommentThreadID(uuid())]: true,
      },
      {
        text:
          " in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        type: "link",
        url: "https://www.google.com",
        children: [
          { text: "Blandit aliquam etiam erat velit scelerisque in dictum." },
          {
            text: "Ac felis donec et odio pellentesque diam volutpat commodo.",
            bold: true,
          },
        ],
      },
      {
        text: "Bibendum est ultricies integer quis auctor elit sed.",
        italic: true,
      },
      { text: "fooVariable", code: true },
      { text: "Lectus mauris ultrices eros in cursus" },
      { text: " turpis", underline: true },
      { text: " massa." },
    ],
  },
  {
    id: uuid(),
    type: "image",
    url: "/photos/puppy.jpg",
    caption: "Puppy",
    children: [{ text: "" }],
  },
  {
    type: "h3",
    children: [{ text: "Section Title (Heading H3)" }],
  },
  {
    type: "h4",
    children: [{ text: "Section subtitle (Heading H4)" }],
  },
  {
    type: "paragraph",
    children: [
      {
        [getMarkForCommentThreadID(uuid())]: true,
        text:
          "Cras maximus auctor congue. Sed ultrices elit quis tortor ornare, non gravida turpis feugiat. Morbi facilisis sodales sem quis feugiat. Vestibulum non urna lobortis, semper metus in, condimentum ex. Quisque est justo, egestas sit amet sem ac, auctor ultricies lacus. Pellentesque lorem justo, rhoncus ut magna sit amet, rhoncus posuere libero.",
      },
      {
        text:
          "Cras maximus auctor congue. Sed ultrices elit quis tortor ornare, non gravida turpis feugiat. Morbi facilisis sodales sem quis feugiat. Vestibulum non urna lobortis, semper metus in, condimentum ex. Quisque est justo, egestas sit amet sem ac, auctor ultricies lacus. Pellentesque lorem justo, rhoncus ut magna sit amet, rhoncus posuere libero.",
      },
    ],
  },
];

export default ExampleDocument;
