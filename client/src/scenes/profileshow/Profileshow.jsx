import "./profileshow.css"
import Topbar from "../navbar/topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Share from "../../components/share/Share";
import Feed from "../../components/feed/Feed";
import { setPost } from "../../state";
const Profileshow=()=>{
    const [user, setUser] = useState(null);
  let { userId,Id } =useParams();
  const id=useSelector((state)=>state.id);
  const token = useSelector((state) => state.token);
  const posts= useSelector((state)=> state.posts);
  console.log(posts);

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${Id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };
  useEffect(() => {
      getUser();
  }, [Id]);
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
        <div className="profile">
           <Sidebar userId={Id}/>
            <div className="profileRight">
              <div className="profileRightTop">
                  <div className="profileCover">
                      <img className="profileUserImg" src={user.picturePath} alt=""/>
                  </div>
                <div className="profileInfo">
                    <h4 className="profileInfoName">{name} </h4>
                </div>
              </div>
               <div className="profileRightBottom">
                  <Feed userId={Id} isProfile />
              </div> 
            </div>
        </div>
      </>
    );
}

export default Profileshow;