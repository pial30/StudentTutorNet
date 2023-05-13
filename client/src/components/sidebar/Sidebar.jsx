import React from "react";
import "./sidebar.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Sidebar = ({userId}) => {
  
    const [user, setUser] = useState(null);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const Id=useSelector((state)=>state.id);
  
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

    const {
        firstName,
        lastName,
        email,
        school,
        company,
        about,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
      } = user;
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
         {(userId==Id || location) && ( <li className="sidebarListItem">
            <span className="sidebarListItemText">Lives in {location}</span>
          </li>)}
          {(userId==Id || occupation) && ( <li className="sidebarListItem">
            <span className="sidebarListItemText">working at {occupation}</span>
          </li>)}
          {(userId==Id || company) && ( <li className="sidebarListItem">
              <span className="sidebarListItemText">Experience on {company}</span>
            </li>)}
          {(userId==Id || school) && ( <li className="sidebarListItem">
            <span className="sidebarListItemText">Studying at {school}</span>
          </li>)}
          {(userId==Id || about) && ( <li className="sidebarListItem">
            <span className="sidebarListItemText">About me: {about}</span>
          </li>)}
        </ul>
        {Id==userId &&(<button className="sidebarButton" onClick={() => navigate(`/profile/edit/${Id}`)}>Edit</button>)}
      </div>
    </div>
  );
};

export default Sidebar;