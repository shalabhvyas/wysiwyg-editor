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

export const activeCommentThreadDataSelector = selector({
  key: "activeCommentThreadData",
  get: ({ get }) => {
    const activeCommentThreadID = get(activeCommentThreadIDAtom);
    if (activeCommentThreadID == null) {
      return null;
    }

    return {
      threadID: activeCommentThreadID,
      threadData: get(commentThreadsState(activeCommentThreadID)),
    };
  },
});
