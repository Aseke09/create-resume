import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/home/Dashboard';
import EditResume from './pages/resumeUpdate/EditResume';
import { fetchUserProfile } from "./features/user/userSlice";
import { useAppDispatch } from "./store/hooks";


const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    dispatch(fetchUserProfile());
  }
}, [dispatch]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />}/>

          <Route path='/login' element={<Login />}/>
          <Route path='/signUp' element={<SignUp />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/resume/:resumeId' element={<EditResume />}/>
        </Routes>
      </Router>

    <Toaster
       toastOptions={{
        className: "",
        style: {
          fontSize: "13px",
        }
       }}
    /> 
    </div>
  )
}

export default App
