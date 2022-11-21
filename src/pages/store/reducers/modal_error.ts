import { ErrorModal } from './../../../../components/organisms/Modal_Error_Shop';
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


const functionEvent = () => {

}



export const userState = createSlice({
    name: 'modal',
    initialState: {
        modal:{
            title: 'Si è verificato un errore!',
            description: 'per ora è impossibile procedere. riprova più tardi',
            closeText: 'chiudi',
            openModalMath: 1,
            handleEvent: functionEvent(),
            confirmText: ''
        }
    },
    reducers: {
        setModalTitleAndDescription: (state, action) => {
            state.modal = {
                ...state.modal,
                title: action.payload.title,
                description: action.payload.description,
                openModalMath: Math.random()
            }
        },
        handleOpenModal: (state, action) => {
            state.modal = {
                ...state.modal,
                openModalMath: Math.random()
            }

        }
    },
});

export const { setModalTitleAndDescription, handleOpenModal } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.modal.modal;


export default userState.reducer