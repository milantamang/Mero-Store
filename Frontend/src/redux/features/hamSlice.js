import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false
}

export const hamSlice = createSlice({
  name: 'hamburger',
  initialState,
  reducers: {
    toggle: (state) => {
    
      state.value = !state.value
    },
    close: (state) => {
      state.value = false
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {toggle,close} = hamSlice.actions

export default hamSlice.reducer