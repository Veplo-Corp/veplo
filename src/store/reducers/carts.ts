import { sortShopsInCart } from './../../../components/utils/sortShopsInCart';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'
import { CartDispatch } from '../../interfaces/carts.interface'
import { Product } from '../../interfaces/product.interface'




const initialState: {
    carts: CartDispatch[]
} = {
    carts: []
}





export const userState = createSlice({
    name: 'carts',
    initialState,
    reducers: {
        setCarts: (state, action) => {
            state.carts = sortShopsInCart(action.payload);
        },
        editVariationFromCart: (state, action) => {
            state.carts = action.payload.carts
        },
        resetCarts: (state) => {
            state.carts = [];
        },


    },
});

export const { setCarts, editVariationFromCart, resetCarts } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.carts;


export default userState.reducer