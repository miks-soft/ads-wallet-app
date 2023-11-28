import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INITIAL_REGION } from '#env';

import AuthAPI from '#api/controllers/Auth';

import { REGIONS } from '#config';

const initialState = {
  signedIn: false,
  currentBusinessAccountId: '',
  region: INITIAL_REGION as REGIONS,
  stubs: {
    noBusinessAccount: false,
    notVerified: false,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSignedIn(state, action: PayloadAction<boolean>) {
      state.signedIn = action.payload;
    },
    setCurrentBusinessAccountId(state, action: PayloadAction<string>) {
      state.currentBusinessAccountId = action.payload;
    },
    setStubs(
      state,
      action: PayloadAction<Partial<(typeof initialState)['stubs']>>,
    ) {
      state.stubs = { ...state.stubs, ...action.payload };
    },
    setRegion(state, action: PayloadAction<REGIONS>) {
      state.region = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addMatcher(AuthAPI.endpoints.logout.matchPending, state => ({
      ...initialState,
      region: state.region,
    }));
  },
});

export default appSlice.reducer;
export const AppActions = appSlice.actions;
