import React from "react";
import { channelContext, videoContext } from "../Components/App";
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import VideoCard from "../Components/VideoCard";

const Channel = () => {
  const [videoList, setVideoList] = React.useState();
  const [currentChannel, setCurrentChannel] = React.useState();

  const videoContextData = React.useContext(videoContext);
  const channelContextData = React.useContext(channelContext);

  const { channelName } = useParams();

  React.useEffect(() => {
    const currentChannel = channelContextData.find(
      (item) => item.id == channelName
    );
    setCurrentChannel(currentChannel);

    const filteredVideos = videoContextData.filter(
      (video) => video.channel_id === channelName
    );
    setVideoList(filteredVideos);
  }, [channelContextData, channelName, videoContextData]);

  const videoListElements = videoList?.map((item) => (
    <VideoCard type="normal" item={item} />
  ));

  return (
    <div>
      <div className="your-channel--main" style={{ padding: "5px" }}>
        <Avatar
          sx={{ width: 110, height: 110, marginTop: "20px" }}
          alt="profile pic"
          src={currentChannel?.channel_profile_pic}
        />

        <div className="your-channel--content">
          <h3>{currentChannel?.id}</h3>
          <h4>@{currentChannel?.id}</h4>
        </div>
      </div>
      <hr style={{ marginTop: "30px" }} className="menu--item-hr" />

      <h2 className="channel--subtitle" style={{padding:"5px"}}>All videos...</h2>
      <div className="home--container" style={{ marginTop: "30px" }}>
        {videoListElements}
      </div>
    </div>
  );
};

export default Channel;
