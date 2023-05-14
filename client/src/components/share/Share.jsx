import React from "react";
import "./share.css";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPosts } from "../../state";
import Dropzone from "react-dropzone";
const loginSchema = yup.object().shape({
  description: yup.string(),
  picture: yup.string(),
});

const initialValuesLogin = {
  description: "",
  picture: "",
};
const Share = ({userId}) => {
    const dispatch = useDispatch();
    const [post, setPost] = useState("write your post here");
    const [user, setUser] = useState(null);
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
   
    const handlePost = async (values, onSubmitProps) => {
      const formData = new FormData();
      formData.append("userId", userId);
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
      const searchParams = new URLSearchParams(formData);
    
      const response = await fetch("http://localhost:3001/posts", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const posts = await response.json();
      onSubmitProps.resetForm();
        dispatch(setPosts({ posts }));
       setPost("");
    };
    const handleFormSubmit = async (values, onSubmitProps) => {
      await handlePost(values, onSubmitProps);
      const id=userId;
      const path = `/home`;
      navigate(path);
     };
    return (
        <div className="share">
          <div className="shareWrapper">
            <div className="shareTop">
              {/* <img src={user.picturePath} alt="" className="shareProfileImg" /> */}
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
              <form onSubmit={handleSubmit} className="shareform">
                <textarea
                  className="shareInput"
                  placeholder="write your post"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                ></textarea>
                <>
                      <Dropzone
                      // acceptedFiles=".png,.jpg,.jpeg"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                    {({ getRootProps, getInputProps }) => (
                     
                      <button
                      type="button"
                      className="uploadpic"
                        {...getRootProps()}
                      >
                        <input
                         {...getInputProps() } />
                        {!values.picture ? (
                          <p className="upload">Upload picture</p>
                        ) : (
                          <p className="upload">{values.picture.name}</p>
                        )}
                      </button>
                     
                    )}
                  </Dropzone>  
                  </>
                <button type="submit" className="shareButton">Share</button>
              </form>
               )}
                </Formik>
            </div>
          </div>
        </div>
    );
};

export default Share;