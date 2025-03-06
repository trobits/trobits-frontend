// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Define the type for the user data
// interface IUser {
//     email: string;
//     password: string;
//     // Add other user properties as needed
// }

// interface IInitialState {
//     user: IUser | null;
// }

// // Create a function to get the user from localStorage safely
// const getUserFromLocalStorage = () => {
//     if (typeof window !== 'undefined') { // Check if running in the browser
//         const userFromLocalStorage = localStorage.getItem("user");
//         return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
//     }
//     return null; // Return null if not in the browser
// };

// // Use the function to set the initial state
// const initialState: IInitialState = {
//     user: getUserFromLocalStorage(),
// };

// // Create the slice
// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         setUser: (state, action: PayloadAction<IUser | null>) => {
//             state.user = action.payload;
//             // Save the user to localStorage whenever it is set
//             if (action.payload) {
//                 localStorage.setItem("user", JSON.stringify(action.payload));
//             } else {
//                 localStorage.removeItem("user");
//             }
//         },
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         clearUser: (state) => {
//             state.user = null;
//             localStorage.removeItem("user");
//         }
//     },
// });

// // Export actions and reducer
// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;








/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the user data


interface IInitialState {
    user: any | null;
    token: string | null;
    previousPath: string | null;
    currentPath:string|null;
}

// Set initial state without using localStorage
const initialState: IInitialState = {
    user: null,
    token: null,
    previousPath:null,
    currentPath:null
};

// Create the slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<any | null>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            // localStorage.removeItem("refreshToken")
            localStorage.removeItem("accessToken")
        },
        setPaths: (state, action: PayloadAction<string | null>) => {
            if(state.previousPath === null && state.currentPath===null){
                state.previousPath = null;
                state.currentPath = action.payload;
            }else{
                state.previousPath = state.currentPath;
                state.currentPath = action.payload;
            }
        }
    },
});

// Export actions and reducer
export const { setUser, clearUser,setPaths } = authSlice.actions;
export default authSlice.reducer;
