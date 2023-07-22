import userState from './reducers/user';
import { configureStore } from '@reduxjs/toolkit';
import addressState from './reducers/address_user';
import modalState from './reducers/globalModal';
import cartsState from './reducers/carts';
import ordersState from './reducers/orders';
import brandsState from './reducers/brands';


export const store = configureStore({
  reducer: {
    user: userState,
    address: addressState,
    modal: modalState,
    carts: cartsState,
    orders: ordersState,
    brands: brandsState
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch