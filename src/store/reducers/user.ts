import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'


// Define the initial state using that type

const initialState: any = {
  user: {
    email: null,
    Not_yet_Authenticated_Request: true
  }

}

export const userState = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.user = {
        genderSelected: state?.user?.genderSelected ? state?.user?.genderSelected : '',
        ...action.payload,

      }
    },
    logout: (state) => {
      state.user = undefined
      // state.user = {
      //   email:null,
      //   Not_yet_Authenticated_Request: false
      // };
    },
    addFavouriteShopBusiness: (state, action) => {
      state.user = {
        ...state.user,
        favouriteShop: action.payload
      }
    },
    changeName: (state, action) => {
      state.user = {
        ...state.user,
        userInfo: {
          name: action.payload
        }
      }
    },

    changeGenderSelected: (state, action) => {
      state.user = {
        ...state.user,
        genderSelected: action.payload
      }
    }
  },
});

export const { login, logout, addFavouriteShopBusiness, changeName, changeGenderSelected } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;


export default userState.reducer