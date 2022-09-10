import { configureStore } from '@reduxjs/toolkit'
import selectedSiteReducer from './selectedSite'

export const store = configureStore({
  reducer: {
    selectedSite: selectedSiteReducer,
  },
})

