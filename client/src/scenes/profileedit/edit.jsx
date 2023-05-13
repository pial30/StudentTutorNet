import "./edit.css";
import { useState, useEffect } from "react";
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
import { useNavigate,useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setLogin, setMe } from "../../state";
import Dropzone from "react-dropzone";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string(),
    occupation: yup.string(),
    school: yup.string(),
    company : yup.string(),
    about : yup.string(),
    picture: yup.string(),
  });
export default function Edit()
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null);
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };
  
    useEffect(() => {
      getUser();
    }, [userId]);
    if (!user) return null;
    
    const initialValuesRegister = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        picture: "",
        location: user.location,
        occupation: user.occupation,
        school : user.school,
        company: user.company,
        about : user.about,
      };
    const edit = async (values, onSubmitProps) => {
        // this allows us to send form info with image
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
        if(values.picture)
        {
          formData.append("picturePath", values.picture.name);
        }
        for (const pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        const savedUserResponse = await fetch(
          `http://localhost:3001/users/${userId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
          
        );
        const savedUser = await savedUserResponse.json();
        if (savedUser) {
         console.log(savedUser.user);
          const name=values.firstName+" "+values.lastName;
         //const name=savedUser.user.firstName+" "+savedUser.user.lastName;
          dispatch(
            setMe({
              user: savedUser.user,
              name: name,
            })
          );
        }
        onSubmitProps.resetForm();
      };
    const handleFormSubmit = async (values, onSubmitProps) => {
       await edit(values, onSubmitProps);

       const path = `/profile/${user._id}`;
          navigate(path);
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
                        
                    <div className="regBox">
                      <span className="field">Firstname:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            className="editInput"
                            />
                      </span>
                      <span className="field">Lastname:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastname"
                            className="editInput"
                            />
                      </span>
                      <span className="field">Email:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            className="editInput"
                            />
                      </span>
                      <span className="picbutton field">Upload picture:
                      <Dropzone
                      acceptedFiles=".png,.jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                    {({ getRootProps, getInputProps }) => (
                     
                      <Button
                      className="picbuttonright"
                        {...getRootProps()}
                      >
                        <input
                         {...getInputProps() } />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <p>{values.picture.name}</p>
                        )}
                      </Button>
                     
                    )}
                  </Dropzone>  
                  </span>
                      <span className="field">Password:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            className="editInput"
                            />
                      </span>
                      <span className="field">School:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.school}
                            name="school"
                            className="editInput"
                            />
                      </span>
                      <span className="field">Company:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.company}
                            name="company"
                            className="editInput"
                            />
                      </span>
                      <span className="field">About:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.about}
                            name="about"
                            className="editInput"
                            />
                      </span>
                      <span className="field">Location:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location"
                            className="editInput"
                            />
                      </span>
                      <span className="field">Occupation:
                        <input
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.occupation}
                            name="occupation"
                            className="editInput"
                            />
                      </span>
                    <button 
                        type="submit"
                    className="loginButton"
                    >Save</button>
                    </div>
                </div>
            </form>
            )}
        </Formik>
    )
}