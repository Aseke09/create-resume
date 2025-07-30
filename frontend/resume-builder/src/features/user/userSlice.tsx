import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import type { UserType, UserUpdatePayload } from './types';

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

export const updateUserProfile = createAsyncThunk<
 UserType, UserUpdatePayload, { rejectValue: string}
>(
  'user/updateUserProfile',
  async (updatedData, thunkAPI) => {
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, updatedData);
      return response.data;
    } catch (err) {
      console.error('Failed to update user:', err)
      return thunkAPI.rejectWithValue('Failed to update profile');
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const payload = action.payload;

      if (payload && typeof payload === 'object') {
        const { token, ...user } = payload;
        state.user = user;
        state.token = token ?? null;
    
      if (token) {localStorage.setItem('token', token);

      } else {
        localStorage.removeItem('token');
      }
    } else {
      console.warn('Invalid payload for updateUser:', payload)
    }
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
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        userSlice.caseReducers.updateUser(state, action);
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update user';
      })
  }
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;