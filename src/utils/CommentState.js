import { atom, atomFamily, selector } from "recoil";

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

export const allCommentThreadsState = selector({
  key: "allCommentThreads",
  get: ({ get }) => {
    const threadIDs = get(commentThreadIDsState);
    return new Map(threadIDs.map((id) => [id, get(commentThreadsState(id))]));
  },
});
