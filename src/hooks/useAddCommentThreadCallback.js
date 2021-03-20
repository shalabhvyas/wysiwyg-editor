import {
  commentThreadIDsState,
  commentThreadsState,
} from "../utils/CommentState";

import { useRecoilCallback } from "recoil";

export default function useAddCommentThreadCallback() {
  return useRecoilCallback(
    ({ set }) => (id, threadData) => {
      set(commentThreadIDsState, (ids) => new Set([...Array.from(ids), id]));
      set(commentThreadsState(id), threadData);
    },
    []
  );
}
