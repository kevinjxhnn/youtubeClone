import React from "react";
import VideoCard from "../Components/VideoCard";
import { db } from "../services/Firebase";
import { getDocs, collection } from "firebase/firestore";

const Home = (prop) => {
  

  const videoListElements = prop.videoList.map((item) => (
    <VideoCard type="normal" item={item} />
  ));

  return <div className="home--container">{videoListElements}</div>;
};

export default Home;
