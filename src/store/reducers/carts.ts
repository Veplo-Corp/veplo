import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'
import { Cart } from '../../interfaces/carts.interface'




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
    },
});

export const { setCarts } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.carts;


export default userState.reducer