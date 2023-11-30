import React from "react";
import Avatar from '@mui/material/Avatar';
import Input from '@mui/material/Input';


const NewComment = () => {
  return (
    <div className="comment--container">
      <div className="comment--new-comment">
        <Avatar
          sx={{ width: 40, height: 40 }}
          alt="profile pic"
          src="https://yt3.ggpht.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iMXlDWO-kDHut3uI4MgIEAQ9StK0qOST7fiA=s68-c-k-c0x00ffffff-no-rj"
        />

        <Input
          className="comment--input"
          placeholder="Add a comment..."
          type="text"
          sx={{borderColor:"#ccc"}}
        />

      </div>
    </div>
  ); 
};

export default NewComment;
