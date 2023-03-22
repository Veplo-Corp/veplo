import { Order } from './../../interfaces/order.interface';
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'





const initialState: {
    orders: Order[]
} = {
    orders: []
}





export const userState = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        detroyOrders: (state) => {
            state.orders = []
        },

    },
});

export const { setOrders, detroyOrders } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.orders;


export default userState.reducer