// import { createStore, applyMiddleware, compose } from "redux";
// import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { promiseMiddleware } from "@adobe/redux-saga-promise";
// import createSagaMiddleware from "redux-saga";
// // import rootReducer from "./reducers";
// // import rootSaga from "./sagas";
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// const persistConfig = {
//   key: "root",
//   storage: storage,
//   blacklist: ["commentsLayer", "reportEvents", "reportLog"],
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // saga
// const sagaMiddleware = createSagaMiddleware();

// // flipper
// // const flipperReduxMiddleware = require("redux-flipper").default;

// const middlewares = [
//   promiseMiddleware,
//   sagaMiddleware,
//   // flipperReduxMiddleware(),
// ];

// // debugger
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const store = createStore(
//   persistedReducer,
//   composeEnhancers(applyMiddleware(...middlewares))
// );

// sagaMiddleware.run(rootSaga);
// export default store;

// store.js
import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
