import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface AccountState {
  currentUser: User | null;
  sessionChecked: boolean;
}

const initialState: AccountState = {
  currentUser: null,
  sessionChecked: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.sessionChecked = true;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;