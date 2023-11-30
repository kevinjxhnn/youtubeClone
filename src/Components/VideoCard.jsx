import React from "react";
import { Link } from "react-router-dom";
import { db } from "../services/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { channelContext } from "./App";

const VideoCard = (prop) => {
  const channelContextData = React.useContext(channelContext);
 

  const [currentChannel, setCurrentChannel] = React.useState({});

  const getChannelData = channelContextData?.find(
    (item) => item.id == prop.item.channel_id
  );

  React.useEffect(() => {
    setCurrentChannel(getChannelData);
  }, [channelContextData]);

  function calculateDaysAgo(publishedTimestampSeconds) {
    const currentDateMilliseconds = new Date().getTime();
    const firebaseDatetimeMilliseconds = publishedTimestampSeconds * 1000;
    const timeDifference =
      currentDateMilliseconds - firebaseDatetimeMilliseconds;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo;
  }

  return (
    <Link
      to={`/video/${prop.item.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="videocard--container">
        <img
          className="videocard--image"
          src={prop.item.thumbnail}
          alt="thumbnail"
        />
        <div className="videocard--details-container">
          <img
            className="videocard--channel-img"
            src={currentChannel?.channel_profile_pic}
            alt="profile pic"
          />
          <div className="videocard--texts">
            <h1 className="videocard--title">{prop.item.title}</h1>
            <h2 className="videocard--channel-name">{prop.item.channel_id}</h2>
            <div className="videocard--info">{`${calculateDaysAgo(
              prop.item.published.seconds
            )} days ago`}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
