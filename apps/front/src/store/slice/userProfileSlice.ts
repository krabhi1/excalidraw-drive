import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProfile } from '../../interfaces'
import { RootState } from '..'

interface UserProfileState {
    value?: UserProfile
}

const initialState: UserProfileState = {
    value: undefined
}

const userProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.value = action.payload
        }
    }
})

export default userProfileSlice.reducer
export const { setProfile } = userProfileSlice.actions
export const selectProfile = (state: RootState) => state.userProfile.value
