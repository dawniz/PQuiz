import { configureStore } from "@reduxjs/toolkit";
import quizChooserSlice from "./reducers/quizChooserSlice";
import appSlice from "./reducers/appSlice";
import quizSlice from "./reducers/quizSlice";

export const store = configureStore({
    reducer: {
        layout: appSlice,
        quizParams: quizChooserSlice,
        quiz: quizSlice
    }
})

const unsubscribe = store.subscribe(() =>
    console.log('State after dispatch: ', store.getState())
  )

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
