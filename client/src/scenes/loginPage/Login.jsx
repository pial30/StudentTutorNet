import "./login.css";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  const initialValuesLogin = {
    email: "",
    password: "",
  };
export default function Login()
{
  alert(process.env.REACT_APP_API_URL);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if (loggedIn) {
          const name=loggedIn.user.firstName+" "+loggedIn.user.lastName;
          dispatch(
            setLogin({
              user: loggedIn.user,
              id: loggedIn.user._id,
              name: name,
              token: loggedIn.token,
            })
          );
          const id=loggedIn.user._id;
          const path = `/profile/${id}`;
          navigate(path);
        }
      };
    const handleFormSubmit = async (values, onSubmitProps) => {
       await login(values, onSubmitProps);
      };
    return(
       

                <div className="login">
                    <div className="loginWrapper">
                        <div className="loginLeft">
                            <h3 className="loginLogo">StudentTutorNet</h3>
                                <span className="loginDesc">
                                    Connect with your tutor or student
                                </span>

                        </div>
                        <div className="loginRight">
                        <div className="loginBox">
                          <Formik
                              onSubmit={handleFormSubmit}
                              initialValues={initialValuesLogin}
                              validationSchema={loginSchema}
                              >
                              {({
                                  values,
                                  errors,
                                  touched,
                                  handleBlur,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue,
                                  resetForm,
                              }) => (
                                  <form onSubmit={handleSubmit} className="form">
                                        <input placeholder="Email" 
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={values.email}
                                      name="email"
                                      className="loginInput"
                                      />
                                      <input placeholder="Password"
                                      className="loginInput"
                                      type="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        />
                                      <button 
                                      type="submit"
                                      className="loginButton"
                                      >Login</button>
                                       </form>
                                        )}
                                    </Formik>
                                    <button 
                                      onClick={() => navigate("/register")}
                                      className="regbutton"
                                    >Create new account</button>                       
                              </div>
                        </div>
                    </div>
                </div>
    )
}