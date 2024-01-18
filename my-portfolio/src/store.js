import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers/index";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers(
      [
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__(),
      ].filter(Boolean)
    ),
});

export default store;
