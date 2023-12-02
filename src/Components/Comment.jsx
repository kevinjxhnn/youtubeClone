import React from "react";
import Avatar from "@mui/material/Avatar";
import {calculateDaysAgo} from "../utils/calculateDaysAgo"
 
const Comment = (prop) => {
  const data = prop.commentsData;


  return (
    <div className="user-comment--container">
      <Avatar
        sx={{ width: 35, height: 35 }}
        alt="profile pic"
        src={data.channel_profile_pic}
      />

      <div className="user-comment--details">
        <span className="user-comment--name">
          {data.channel_id}{" "}
          <span className="user-comment--date">{calculateDaysAgo(data.published?.seconds)} day ago</span>
        </span>
        <span className="user-comment--text">{data.content}</span>
      </div>
    </div>
  );
};

export default Comment;
