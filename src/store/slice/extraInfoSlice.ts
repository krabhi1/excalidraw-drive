import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ExtraInfo } from '../../interfaces'
import { RootState } from '..'

interface ExtraInfoState {
    value: ExtraInfo
}

const initialState: ExtraInfoState = {
    value: {}
}

const extraInfoSlice = createSlice({
    name: 'extraInfo',
    initialState,
    reducers: {
        setSelectedFileId: (state, action: PayloadAction<string|undefined>) => {
            state.value = { ...state.value, selectedFileId: action.payload }
        },
        setExtraInfo: (state, action: PayloadAction<ExtraInfo>) => {
            state.value =action.payload
        }
    }
})

export default extraInfoSlice.reducer
export const { setSelectedFileId } = extraInfoSlice.actions
export const selectExtraInfo = (state: RootState) => state.extraInfo.value
