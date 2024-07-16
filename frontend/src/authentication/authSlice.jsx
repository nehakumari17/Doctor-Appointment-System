import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "authentication",
    initialState: {user: null, isLoggedIn: false},
    reducers: {
        login(state, action){
            state.user = action.payload.user;
            state.isLoggedIn = true
        },
        logout(state){
            state.isLoggedIn = false
            state.user = null
        }
    }
})

export const {login, logout} = authSlice.actions

export default authSlice.reducer;