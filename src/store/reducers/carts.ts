import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'
import { Cart } from '../../interfaces/carts.interface'
import { Product } from '../../interfaces/product.interface'




const initialState: {
    carts: Cart[]
} = {
    carts: []
}





export const userState = createSlice({
    name: 'carts',
    initialState,
    reducers: {
        setCarts: (state, action) => {
            state.carts = action.payload;
            console.log(state);
            console.log(action.payload);

        },
        editVariationFromCart: (state, action) => {
            console.log(action.payload.carts);

            state.carts = action.payload.carts
        }

    },
});

export const { setCarts, editVariationFromCart } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.carts;


export default userState.reducer