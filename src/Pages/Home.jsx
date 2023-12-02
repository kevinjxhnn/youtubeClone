import React from "react";
import VideoCard from "../Components/VideoCard";
import { db } from "../services/Firebase";
import { getDocs, collection } from "firebase/firestore";

const Home = (prop) => {
  const filtered = prop.videoList.filter(
    (video) => video.channel_id !== localStorage.getItem("channelName")
  );

  const videoListElements = filtered.map((item) => (
    <VideoCard type="normal" item={item} />
  ));


  return <div className="home--container">{videoListElements}</div>;
};

export default Home;
