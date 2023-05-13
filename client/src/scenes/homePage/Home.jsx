import "./home.css"
import Topbar from "../navbar/topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Share from "../../components/share/Share";
import Feed from "../../components/feed/Feed";
import { setPost } from "../../state";
const Home=()=>{
    const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const {postid}=useParams();
  const id=useSelector((state)=>state.id);
  const posts= useSelector((state)=> state.posts);
  console.log(posts);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);
  if (!user) return null;

  const {
    firstName,
    lastName,
    picturePath,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;
  const name=firstName+" "+lastName;
   const path=user.picturePath;
    return (
        <>
        <Topbar id={id} />
        <div className="homeRight">
            <div className="homeRightTop">
                <div className="profileCover">
                    <img className="profileUserImg" src={user.picturePath} alt=""/>
                </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{name} </h4>
            </div>
            </div>
            <div className="homeRightBottom">
              { postid && (  <Feed userId={id} Id={postid}/>)}
              { !postid && (  <Feed userId={id}/>)}
            </div> 
        </div>
      </>
    );
}

export default Home;