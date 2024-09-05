import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SignInStart: (state) => {
      state.loading = true;
    },
    SignInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    SignInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    UpdateUserStart: (state) => {
      state.loading = true;
    },
    UpdateUserSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    UpdateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    DeleteUserStart: (state) => {
      state.loading = true;
    },
    DeleteUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    DeleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    SignOutStart: (state) => {
      state.loading = true;
    },
    SignOutUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    SignOutUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  SignInStart,
  SignInSuccess,
  SignInFailure,
  UpdateUserStart,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  DeleteUserFailure,
  SignOutStart,
  SignOutUserSuccess,
  SignOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
