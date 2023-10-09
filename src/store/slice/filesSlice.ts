import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FileInfo } from '../../interfaces'
import { RootState } from '..'
import { DEFAULT_FILE_INFO, randomFileInfo } from '../../others/utils'

interface FileInfoState {
    value: FileInfo[]
}

const initialState: FileInfoState = {
    value: []
}

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<FileInfo[]>) => {
            state.value = action.payload
        },
        setDriveFiles: (state, action: PayloadAction<FileInfo[]>) => {
            const newFiles = state.value.filter((e) => e.isNew)
            state.value = [...newFiles, ...action.payload]
        },
        updateAt: (state, action: PayloadAction<{ index: number, info: FileInfo }>) => {
            const { index, info } = action.payload
            state.value[index] = info
        },
        createOfflineFile: (state, action: PayloadAction<{ name: string, id: string }>) => {
            const { name, id } = action.payload

            state.value.push({ ...DEFAULT_FILE_INFO, name, id, isNew: true })
        },
        updateWithId: (state, action: PayloadAction<{ id: string, info: Partial<FileInfo> }>) => {
            const { id, info } = action.payload
            const fileIndex = state.value.findIndex((e) => e.id == id)
            if (fileIndex != -1) {
                state.value[fileIndex] = { ...state.value[fileIndex], ...info }
            } else {
            }
        },
        removeWithId: (state, action: PayloadAction<string>) => {
            const id = action.payload
            const newItems = state.value.filter((e) => e.id != id)
            state.value = newItems
        }
    }
})



export default filesSlice.reducer
export const { removeWithId, setFiles, updateAt, createOfflineFile, setDriveFiles, updateWithId } = filesSlice.actions
export const selectFiles = (state: RootState) => state.files.value
