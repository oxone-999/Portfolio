import { createSlice } from '@reduxjs/toolkit';
import { bundledDefaultContent } from '../services/portfolioContent';

/**
 * Content is server-sourced (Supabase) once configured — this slice just
 * holds whatever was last fetched. Bundled defaults are the pre-fetch and
 * no-backend-configured fallback, so the site never renders empty.
 */
const initialState = {
  content: bundledDefaultContent(),
  status: 'idle', // idle | loading | ready | error
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setPortfolioContent: (state, action) => {
      state.content = action.payload;
      state.status = 'ready';
    },
    setContentStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setPortfolioContent, setContentStatus } = adminSlice.actions;
export default adminSlice.reducer;
