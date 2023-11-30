import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import IosShareIcon from "@mui/icons-material/IosShare";
import NewComment from "../Components/NewComment";
import Comment from "../Components/Comment";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { db } from "../services/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { videoContext } from "../Components/App";
import VideoCard from "../Components/VideoCard";

const Video = ({ allChannelData }) => {
  const videoContextData = React.useContext(videoContext);

  const [videoData, setVideoData] = React.useState({});
  console.log(videoData.tags);
  const [currentChannel, setCurrentChannel] = React.useState({});

  const { id } = useParams();

  const videosCollectionRef = doc(db, "videos", id);

  const currentVideoTags = videoData.tags;

  const filteredVideos = videoContextData
    .filter((video) =>
      video.tags.some((trimmedTag) => currentVideoTags?.includes(trimmedTag))
    )
    .filter((video) => video.id !== id);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const video = await getDoc(videosCollectionRef);
        if (video.exists()) {
          setVideoData({ ...video.data(), id: video.id });

          if (Array.isArray(allChannelData)) {
            const current = allChannelData.find(
              (item) => item.id === video.data().channel_id
            );
            setCurrentChannel(current);
          }
        } else {
          console.log("Video not found.");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [allChannelData]);

  const videoListElements = filteredVideos.map((item) => (
    <VideoCard type="normal" item={item} size="small"/>
  ));

  return (
    <div className="video--container">
      <div className="video--content">
        <div className="video--video-wrapper">
          <iframe
            width="100%"
            height="550"
            src={videoData.video}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <h1 className="video--title">{videoData.title}</h1>
        <div className="video--details">
          <div className="video--button-container">
            <button>
              <IosShareIcon />
            </button>
            <button>
              <ThumbUpIcon />
            </button>
            <p className="like-counter">234</p>
          </div>
        </div>

        <hr
          className="video--hr"
          style={{ marginBottom: "5px", border: "none" }}
        />
        <div className="video--channel">
          <div className="video--channel-info">
            <Avatar
              sx={{ width: 40, height: 40 }}
              alt="profile pic"
              src={currentChannel.channel_profile_pic}
            />

            <div className="video--channel-details">
              <span className="video--channel-name">
                {videoData?.channel_id}
              </span>

              <span className="video--channel-counter">
                {currentChannel?.subscribers} subscribers
              </span>
            </div>
          </div>
          <button className="subscribe">Subscribe</button>
        </div>
        <p className="video--description">{videoData.description}</p>
        <hr className="video--hr" style={{ marginTop: "10px" }} />

        <NewComment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </div>
      <div className="video--recommendation">{videoListElements}</div>
    </div>
  );
};

export default Video;
