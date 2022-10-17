import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface UserState {
    name: string,
    age: number
}

// Define the initial state using that type
const initialState: UserState = {
    name: 'Nicolò',
    age: 27
}

export const userState = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: initialState,
    reducers: {
        changeName: (state) => {
            if(state.name === 'Nicolò'){
                state.name = 'Merlo'
                return
            }
            state.name = 'Nicolò'
        },
    },
})

export const { changeName } = userState.actions

// Other code such as selectors can use the imported `RootState` type
export const selectName = (state: RootState) => state.user.name

export default userState.reducer