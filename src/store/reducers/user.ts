import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { useEffect } from 'react'


// Define the initial state using that type

const initialState: any = {
  user: {
    email: null,
    statusAuthentication: 'not_yet_authenticated'
  }

}

export const userState = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.user = {
        genderSelected: state?.user?.genderSelected ? state?.user?.genderSelected : '',
        gategoryTypeSelected: state?.user?.gategoryTypeSelected ? state?.user?.gategoryTypeSelected : '',

        ...action.payload,

      }
    },
    logout: (state) => {

      state.user = {
        genderSelected: state?.user?.genderSelected ? state?.user?.genderSelected : '',
        gategoryTypeSelected: state?.user?.gategoryTypeSelected ? state?.user?.gategoryTypeSelected : '',
        statusAuthentication: 'logged_out'
      }

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
    },
    changeUnivers: (state, action) => {
      if (action.payload === 'accessori' || action.payload === 'abbigliamento') {
        state.user = {
          ...state.user,
          gategoryTypeSelected: action.payload
        }
      }
    },
    changeFavouriteShops: (state, action) => {
      if (action.payload) {
        state.user = {
          ...state.user,
          favouriteShops: action.payload.favouriteShops
        }
      }
    }
  },
});

export const { login, logout, addFavouriteShopBusiness, changeName, changeGenderSelected, changeUnivers, changeFavouriteShops } = userState.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;


export default userState.reducer