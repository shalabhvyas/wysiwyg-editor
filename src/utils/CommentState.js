import { atom, atomFamily } from "recoil";

import React from "react";

export const SetActiveCommentThreadIDContext = React.createContext(null);

export const commentThreadsState = atomFamily({
  key: "commentThreads",
  default: null,
});

export const commentThreadIDsState = atom({
  key: "commentThreadIDs",
  default: new Set([]),
});

export const activeCommentThreadIDAtom = atom({
  key: "activeCommentThreadID",
  default: null,
});
