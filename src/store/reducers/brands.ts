import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'
import axios from 'axios'


// Define the initial state using that type

const initialState: { brands: string[] } = {
    brands: ['']
}


export const brandsState = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setBrands: (state, action) => {
            state.brands = action.payload

        },
    },
});

export const { setBrands } = brandsState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBrands = (state: RootState) => state.brands.brands;


export default brandsState.reducer