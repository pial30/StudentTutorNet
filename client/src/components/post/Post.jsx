import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AccountCircle } from "@mui/icons-material";
import "./post.css"
import { Formik } from "formik";
import * as yup from "yup";
import { Box, Divider, IconButton, Typography, useTheme} from "@mui/material";
import DeleteIcon from '@mui/icons-material//Delete';
import CommentIcon from '@mui/icons-material/Comment';
import { setPost, setPosts } from "../../state";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  comment: yup.string(),
});

const initialValuesLogin = {
  comment: "",
};

const Post = ({
    postId,
    postUserId,
    name,
    description,
    likes,
    comments,
    picturePath,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const [isLike, setIslike] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const id=useSelector((state)=>state.id);
    const loggedInUserId = useSelector((state) => state.id);
     const username=useSelector((state) => state.name);
    const navigate = useNavigate();
  console.log(Array.isArray(likes))
    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      };

      const postdelete = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/delete`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        });
        const updatedPost = await response.json();
        console.log(updatedPost);
        dispatch(setPosts({ post: updatedPost }));
      };



      const patchcomment = async (values, onSubmitProps) => {
        const formData = new FormData();
        const commentusername=username;
        const userId=id;
        formData.append("userId", userId);
        formData.append("commentusername", commentusername);
        for (let value in values) {
          formData.append(value, values[value]);
        }
        for (const pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        const searchParams = new URLSearchParams(formData);
      
        const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
          method: "PATCH",
           headers: {
              Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
           },
          body:searchParams.toString(),
        });
        onSubmitProps.resetForm();
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      };
      const handleFormSubmit = async (values, onSubmitProps) => {
        await patchcomment(values, onSubmitProps);
      
       };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <span className="postUsername" onClick={()=>navigate(`/profile/${id}/${postUserId}`)}>
            <AccountCircle /> {name}
            </span>
          </div>
          <div className="postTopRight">
           {id==postUserId && (<span onClick={postdelete}><DeleteIcon style={{ color: 'red', cursor:"pointer" }} /></span>)}
          </div>
        </div>
        <div className="postCenter">
          {picturePath && (<img className="postpic" src={picturePath} alt=""/>)}
          <span className="postText">{description}</span>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img src="/assets/like.png" onClick={patchLike} alt="" className="likeIcon" />
            <span className="postLikeCounter" onClick={()=> setIslike(!isLike)}>{likes.length} people react it</span>
          </div>
          <div className="postBottomRight">
            <div className="postCommentText" onClick={() => setIsComments(!isComments)}><CommentIcon /> {comments.length} comments</div>
          </div>
        </div>
        {isLike && (
          <div className="likes-box">
            {likes.map((like, i) => (
                <div key={i} className="like">
                  <span className="likeusername" onClick={()=>navigate(`/profile/${id}/${like.userId}`)}>{like.likeusername}</span>
                </div>
              ))}
              </div>
        )}
        {isComments && (
              <div className="comments-box">
                 {comments.map((comment, i) => (
                      <div key={i} className="comment">
                        <span className="commentusername" onClick={()=>navigate(`/profile/${id}/${comment.userId}`)}>{comment.commentusername}</span>
                        <p>{comment.comment}</p>
                      </div>
                    ))}
                    
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
                      <form onSubmit={handleSubmit} className="shareformc">
                        <textarea
                          className="shareInputc"
                          placeholder="write your comment"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.comment}
                          name="comment"
                        ></textarea>
                        <button type="submit" className="shareButtonc">comment</button>
                      </form>
                      )}
                </Formik>
              </div>
         )}
      </div>
    </div>
  );
};

export default Post;