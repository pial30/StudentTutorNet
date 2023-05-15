import "./register.css";
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
import Dropzone from "react-dropzone";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    picturePath: yup.string(),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
  });

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    picturePath: "",
    location: "",
    occupation: "",
  };
export default function Register()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const register = async (values, onSubmitProps) => {
        // this allows us to send form info with image
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
        const savedUserResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/register`,
          {
            method: "POST",
            body: formData,
          }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();
        if (savedUser) {
          dispatch(
            setLogin({
              user: savedUser.user,
              token: savedUser.token,
            })
          );
          const path = "/";
          navigate(path);
        }
      };
    const handleFormSubmit = async (values, onSubmitProps) => {
       await register(values, onSubmitProps);
      };
    return(
        <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
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
            <form onSubmit={handleSubmit}>

                <div className="login">
                    <div className="loginWrapper">
                        <div className="loginLeft">
                            <h3 className="loginLogo">StudentTutorNet</h3>
                                <span className="loginDesc">
                                Connect with your tutor or student
                                </span>

                        </div>
                        <div className="loginRight">
                            <div className="regBox">
                                <input placeholder="First Name"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.firstName}
                                  name="firstName"
                                 className="loginInput"
                                  />
                                <input placeholder="Lastname" 
                                 onBlur={handleBlur}
                                 onChange={handleChange}
                                 value={values.lastName}
                                 name="lastName"
                                className="loginInput" 
                                />
                            <input placeholder="Location" 
                               onBlur={handleBlur}
                               onChange={handleChange}
                               value={values.location}
                               name="location"
                            className="loginInput"
                             />
                              <input placeholder="occupation" 
                             onBlur={handleBlur}
                             onChange={handleChange}
                             value={values.occupation}
                             name="occupation"
                            className="loginInput"
                             />
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
                            >Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            )}
        </Formik>
    )
}