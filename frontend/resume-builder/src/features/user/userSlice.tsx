import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import type { UserType } from './types';

interface UserState {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem('token'),
};

export const fetchUserProfile = createAsyncThunk<UserType, void, { rejectValue: string }>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      return response.data;
    } catch (err) {
        console.error('Fetch user failed:', err);
        return rejectWithValue('Failed to fetch user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { token, ...user } = action.payload;
      state.user = user;
      state.token = token;
      if (token) localStorage.setItem('token', token);
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  }
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;