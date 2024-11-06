// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./features/slices/authSlice"
// import { baseApi } from "./features/api/baseApi";
// import {storage} from "redux-persist"

// const persisitConfig = {
//     key:"root",
//     storage:storage
// }


// export const store = configureStore({
//     reducer: {
//         [ baseApi.reducerPath ]: baseApi.reducer,
//         auth: authReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(baseApi.middleware),

// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;






// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { baseApi } from './features/api/baseApi';
import authReducer from './features/slices/authSlice';

// Setup Persist Config
const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [ 'auth' ],
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authReducer,
    [ baseApi.reducerPath ]: baseApi.reducer,
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(baseApi.middleware),
});

// Set up Persistor
export const persistor = persistStore(store);

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
