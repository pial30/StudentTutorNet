import React from "react";
import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
const Topbar = ({id}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [search, setsearch] = useState(false);
  const [notifications,setNotifications]=useState(false);
  const userId=useSelector((state)=>state.id);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.token);
  const getUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };
  const deletenotification = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/notification`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };
  const getUsers = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUsers(data);
  };
  useEffect(() => {
      getUser();
      getUsers();
  }, []);
  if (!user) return null;
  if(!users) return null;
  const handleclick=(id)=>{
   
    navigate(`/home/${id}`);
  }
 let notification=[];
 if(user.notification)
 {
   notification=user.notification;
 }
  const notificationNew=[...notification].reverse();
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = searchTerm ? users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo" onClick={() => navigate("/home")}>StudentTutorNet</span>
      </div>
      <i class="material-icons common" onClick={() => navigate("/home")}>home</i>
      <div className="topbarCenter">
        <div className="searchBar">
          <SearchIcon className="searchIcon" onClick={() => setsearch(!search)} />
          <input
            className="searchInput"
            placeholder="Search"
            onChange={handleSearch}
            onClick={() => setsearch(!search)}
          />
          {search && searchTerm && (<div className="searchuser">
           {filteredUsers.map((client) => (
            <p className="notificationElement"onClick={()=>navigate(`/profile/${userId}/${client._id}`)}>{client.name}</p>
          ))}
          </div>)} 
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink"onClick={()=>navigate(`/profile/${id}`)}> <i class="material-icons common">person</i></span>
        </div>
        <div className="topbar-Icons">
          <div className="topbarIconItem">
            <span className="topbarLink" onClick={()=>{setNotifications(!notifications)}}> <i class="material-icons common">notifications</i></span>
            {notification.length>0 && (<span className="topBarIconBadge">{notification.length}</span>)}
          </div>
        </div>
        {notifications && notification.length>0 && (
     
            <div className="popup">
              <i class="material-icons delete" onClick={()=>{deletenotification();setNotifications(!notifications);}}>delete</i>
              {
                notificationNew.map((element, i)=>(
                  <div key={i} className="notificationElement" onClick={()=>{handleclick(element.id)}}>{element.msg}</div>
                ))
              }
            </div>
            )
            }
        <div className="topbarLinks">
          <span className="topbarLink" onClick={() => dispatch(setLogout())}><i class="material-icons common">logout</i></span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;