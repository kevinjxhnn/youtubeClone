import React from "react";
import Avatar from "@mui/material/Avatar";

const Comment = () => {
  return (
    <div className="user-comment--container">
      <Avatar
        sx={{ width: 35, height: 35 }}
        alt="profile pic"
        src="https://yt3.ggpht.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iMXlDWO-kDHut3uI4MgIEAQ9StK0qOST7fiA=s68-c-k-c0x00ffffff-no-rj"
      />

      <div className="user-comment--details">
        <span className="user-comment--name">
          John Doe <span className="user-comment--date">1 day ago</span>
        </span>
        <span className="user-comment--text">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore
          consequuntur voluptas quidem ea ex aut deleniti dolores sed ab
          obcaecati soluta saepe quisquam aliquam similique aspernatur assumenda
          facere, asperiores debitis?
        </span>
      </div>
    </div>
  );
};

export default Comment;
