import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vote {
  title: string;
  contents: string[];
  count: number[];
  closedAt?: string;
  closingTime?: string;
}

interface RootState {
  votes: Vote[];
}

const initialState: RootState = {
  votes: []
};

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    addVote: (state, action: PayloadAction<Vote>) => {
      const vote = action.payload;
      vote.count = new Array(vote.contents.length).fill(0);
      state.votes.push(vote);
    },
    voteContent: (state, action: PayloadAction<{ voteIndex: number, contentIndex: number }>) => {
      const { voteIndex, contentIndex } = action.payload;
      const vote = state.votes[voteIndex];
      vote.count[contentIndex]++;
    },
    deleteVote: (state, action: PayloadAction<number>) => {
      state.votes.splice(action.payload, 1);
    },
    closeVote: (state, action: PayloadAction<number>) => {
      const vote = state.votes[action.payload];
      vote.closedAt = new Date().toISOString();
    }
  }
});

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: votesSlice.reducer,
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type { RootState };
export const { addVote, voteContent, deleteVote, closeVote } = votesSlice.actions;

export default store;



