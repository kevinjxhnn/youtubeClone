import React from "react";
import { Link } from "react-router-dom";

const RecommendedVideoCard = () => {
  return (
    <Link to="/video/1" style={{ textDecoration: "none", color: "inherit" }}>
      <div className="videocard--container-small">
        <img
          className="videocard--image-small"
          src="https://i.ytimg.com/vi/b0HfmY64eSE/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCfdWfbwRMcwhvwEs8j-NDCwPIZdA"
          alt="thumbnail"
        />
        <div className="videocard--details-container-small">
          <img
            className="videocard--channel-img-small"
            src="https://yt3.ggpht.com/lkH37D712tiyphnu0Id0D5MwwQ7IRuwgQLVD05iMXlDWO-kDHut3uI4MgIEAQ9StK0qOST7fiA=s68-c-k-c0x00ffffff-no-rj"
            alt="profile pic"
          />
          <div className="videocard--texts-small">
            <h1 className="videocard--title-small">Test Title</h1>
            <h2 className="videocard--channel-name-small">Kevin</h2>
            <div className="videocard--info-small">10 days ago</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedVideoCard;
