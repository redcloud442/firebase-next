import { AccountHistory } from "@/utils/types";
import { create } from "zustand";

interface accountHistoryState {
  accountHistory: {
    data: AccountHistory[];
    count: number;
  };

  setAccountHistory: ({
    data,
    count,
  }: {
    data: AccountHistory[];
    count: number;
  }) => void;

  addAccountHistory: (data: AccountHistory) => void;
}

export const useAccountHistoryStore = create<accountHistoryState>((set) => ({
  accountHistory: {
    data: [],
    count: 0,
  },

  setAccountHistory: ({ data, count }) =>
    set(() => ({
      accountHistory: { data, count },
    })),

  addAccountHistory: (data: AccountHistory) =>
    set((state) => ({
      accountHistory: {
        data: [data, ...state.accountHistory.data],
        count: state.accountHistory.count + 1,
      },
    })),
}));
