import { createSlice } from '@reduxjs/toolkit';

interface IAuthState {
  user: {
    role: string;
    username: string;
  } | null;
  token: string | null;
}

const initialState: IAuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    localLogout: (state) => {
      state.user = {} as unknown as null;
      state.token = null;
    },
  },
});

export const { setUserToken, setUserData, localLogout } = authSlice.actions;

export default authSlice.reducer;