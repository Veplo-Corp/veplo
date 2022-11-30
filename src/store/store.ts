import userState from './reducers/user';
import { configureStore } from '@reduxjs/toolkit';
import addressState from './reducers/address_user';
import modalState from './reducers/modal_error';


export const store = configureStore({
  reducer: {
    user: userState,
    address: addressState,
    modal: modalState
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch