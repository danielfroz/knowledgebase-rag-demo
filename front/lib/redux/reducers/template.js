import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'template',
  initialState: {
    template: undefined,
  },
  reducers: {
    templateTemplate(state, action) {
      return {
        ...state,
        template: action.payload,
      }
    },
  }
})

export const {
  templateTemplate
} = slice.actions

export const template = slice.reducer