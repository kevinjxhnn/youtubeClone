import React from "react";
import { Link } from "react-router-dom";
import { channelContext } from "./App";
import { calculateDaysAgo } from "../utils/calculateDaysAgo";

const VideoCard = (prop) => {
  const channelContextData = React.useContext(channelContext);

  const [currentChannel, setCurrentChannel] = React.useState({});

  const getChannelData = channelContextData?.find(
    (item) => item.id == prop.item.channel_id
  );

  React.useEffect(() => {
    setCurrentChannel(getChannelData);
  }, [channelContextData, getChannelData]);

  

  return (
    <Link
      to={`/video/${prop.item.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className={
          prop.size ? "videocard--container-small" : "videocard--container"
        }
      >
        <img
          className={prop.size ? "videocard--image-small" : "videocard--image"}
          src={prop.item.thumbnail}
          alt="thumbnail"
        />
        <div
          className={
            prop.size
              ? "videocard--details-container-small"
              : "videocard--details-container"
          }
        >
          <Link
            to={`/channel/${prop.item.channel_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              className={
                prop.size
                  ? "videocard--channel-img-small"
                  : "videocard--channel-img"
              }
              src={currentChannel?.channel_profile_pic}
              alt="profile pic"
            />
          </Link>
          <div
            className={
              prop.size ? "videocard--texts-img-small" : "videocard--texts"
            }
          >
            <h1
              className={
                prop.size ? "videocard--title-small" : "videocard--title"
              }
            >
              {prop.item.title}
            </h1>

            <Link
              to={`/channel/${prop.item.channel_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h2
                className={
                  prop.size
                    ? "videocard--channel-name-small"
                    : "videocard--channel-name"
                }
              >
                {prop.item.channel_id}
              </h2>
            </Link>

            <div
              className={
                prop.size ? "videocard--info-small" : "videocard--info"
              }
            >{`${calculateDaysAgo(prop.item.published?.seconds)} days ago`}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
