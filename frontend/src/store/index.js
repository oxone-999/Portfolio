import { configureStore } from '@reduxjs/toolkit';
import identityReducer from './identitySlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    identity: identityReducer,
    admin: adminReducer,
  },
});
