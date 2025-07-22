import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import resumeReducer from '../features/resume/resumeSlice';
import wizardReducer from '../features/resume/wizardSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    resume: resumeReducer,
    wizard: wizardReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
