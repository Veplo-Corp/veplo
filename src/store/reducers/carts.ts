import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'

type InitialState = {
    address: {
        placeType: undefined | string,
        longitude: undefined | number,
        latitude: undefined | number,
        postcode: undefined | string,
        city: undefined | string,
        address: undefined | string
    }

}


// Define the initial state using that type
const initialState: InitialState = {
    address: {
        placeType: undefined,
        longitude: undefined,
        latitude: undefined,
        postcode: undefined,
        city: undefined,
        address: undefined
    }

}






export const userState = createSlice({
    name: 'carts',
    initialState,
    reducers: {
        // setAddress: (state, action) => {
        //     state.address = action.payload.address;
        //     // console.log(state.address);
        // },
    },
});

export const { /* setAddress */ } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.address.address;


export default userState.reducer