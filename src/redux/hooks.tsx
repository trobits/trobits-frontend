// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "./store";

// // Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppSelector = useSelector.withTypes<RootState>();


// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed hooks for dispatch and selector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
