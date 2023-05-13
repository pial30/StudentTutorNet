import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  id:null,
  name:null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.id = action.payload.id;
      state.name=action.payload.name;
      state.token = action.payload.token;
    },
    setMe: (state, action) => {
      state.user = action.payload.user;
      state.name = action.payload.name;
    },
    setLogout: (state) => {
      state.user = null;
      state.id = null;
      state.name=null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = Array.isArray(action.payload.posts) ? action.payload.posts : [action.payload.posts];
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost,setMe } =
  authSlice.actions;
export default authSlice.reducer;