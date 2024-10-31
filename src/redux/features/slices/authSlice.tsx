
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

// Create the slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },
});

// Export actions and reducer
export default authSlice.reducer;
