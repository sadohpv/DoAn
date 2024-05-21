import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
import { configureStore, Tuple } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";
import { thunk } from "redux-thunk";
// import { composeWithDevTools } from 'redux-devtools-extension';
const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
