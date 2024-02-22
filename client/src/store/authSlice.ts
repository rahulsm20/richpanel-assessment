import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: null,
  user: {},
  facebookUser:{}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFacebookUser: (state,action)=>{
      state.facebookUser = action.payload
    }
  },
});

export const { setAuthenticated, setUser,setFacebookUser} = authSlice.actions;
export default authSlice.reducer;
