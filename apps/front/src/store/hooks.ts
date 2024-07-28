import { AppDispatch, RootState } from "."
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector