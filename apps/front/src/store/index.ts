import { configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./slice/userProfileSlice";
import filesSlice from "./slice/filesSlice";
import extraInfoSlice from "./slice/extraInfoSlice";

const store = configureStore({
    reducer: {
        userProfile: userProfileSlice,
        files: filesSlice,
        extraInfo:extraInfoSlice
    }
})
export default store
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch