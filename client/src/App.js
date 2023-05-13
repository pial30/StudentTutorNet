import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage/Home";
import LoginPage from "./scenes/loginPage/Login";
import RegisterPage from "./scenes/registerPage/Register"
import ProfilePage from "./scenes/profilePage/Profile";
import Profileedit from "./scenes/profileedit/edit"
import Profileshow from "./scenes/profileshow/Profileshow";
import { useSelector } from "react-redux";


function App() {
  const isAuth =Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route
            path="/home"
            element={isAuth ? <HomePage /> : <Navigate to="/" />}
          />
           <Route
            path="/home/:postid"
            element={isAuth ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:userId"
            element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
          />
           <Route
            path="/profile/edit/:userId"
            element={isAuth ? <Profileedit /> : <Navigate to="/" />}
          />
             <Route
            path="/profile/:userId/:Id"
            element={isAuth ? <Profileshow/> : <Navigate to="/" />}
          /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
