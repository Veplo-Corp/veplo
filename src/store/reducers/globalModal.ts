import { ErrorModal } from '../../../components/organisms/Modal_Error_Shop';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'
import { stat } from 'fs';




// Define the initial state using that type
// const initialState: ErrorModal{} = {
//     modal: {

//     }
// }


export type GlobalModal = {
    show?: boolean,
    title?: string,
    description?: string | JSX.Element
}




export const userState = createSlice({
    name: 'modal',
    initialState: {
        modal: {
            show: false
        }
    },
    reducers: {
        openModal: (state, action) => {
            state.modal = {
                ...state.modal,
                show: true,
                description: 'abbiamo riscontrato un errore',
                ...action.payload,
            }
        },
        closeModal: (state) => {
            state.modal = {
                ...state.modal,
                show: false
            }
        }
    },
});

export const { openModal, closeModal } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.modal.modal;


export default userState.reducer