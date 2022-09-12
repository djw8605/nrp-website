import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const selectedSiteSlice = createSlice({
  name: 'selectedSite',
  initialState,
  reducers: {
    updateSite: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateSite } = selectedSiteSlice.actions

export default selectedSiteSlice.reducer