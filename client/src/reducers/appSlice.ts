import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
    currentPath: string
}

const initialState: AppState = {
    currentPath: '/'
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setCurrentPath(state, action: PayloadAction<string>) {
            state.currentPath = action.payload;
        }
    }
});

export const { setCurrentPath } = appSlice.actions

export default appSlice.reducer;