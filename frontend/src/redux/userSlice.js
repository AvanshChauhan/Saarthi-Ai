import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: null,
  status: "loading",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
      state.status = action.payload ? "authenticated" : "unauthenticated"
    },
    clearUserData: (state) => {
      state.userData = null
      state.status = "unauthenticated"
    },
  }
})
export const { setUserData, clearUserData } = userSlice.actions

export default userSlice.reducer
