import React from "react";
import "./feed.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import Post from "../post/Post";

const Feed = ({ userId, isProfile = false, Id }) => {
    const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };
  const getPost = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${Id}/post`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if(Id){
      getPost();
    }
     else if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId,Id,posts.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const postsnew=[...posts].reverse();
  console.log(postsnew);
    return (
      <>
      {posts.length>0 && (
        <div className="feedWrapper"> {
         postsnew.map(
            (post) => post ? (
              <Post
                key={post._id}
                postId={post._id}
                postUserId={post.userId}
                name={`${post.firstName} ${post.lastName}`}
                description={post.description}
                likes={Array.isArray(post.likes) ? post.likes : []}
                comments={Array.isArray(post.comments) ? post.comments: []}
                picturePath={post.picturePath}
              />
            ) : (<div>Can not find the post</div>)
          )          
          }
        </div>
      )}
    </>
    );
  };
  
  export default Feed;