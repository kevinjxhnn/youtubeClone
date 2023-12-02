import "../index.css";
import Menu from "./Menu";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Video from "../Pages/Video";
import Signin from "../Pages/Signin";
import React from "react";

import { db } from "../services/Firebase";
import { collection, getDocs } from "firebase/firestore";
import YourChannel from "../Pages/YourChannel";
import Channel from "../Pages/Channel";
import Subscribtions from "../Pages/Subscribtions";
import Loader from "./Loader";

export const channelContext = React.createContext();
export const videoContext = React.createContext();

function App() {
  const [loader, setLoader] = React.useState(true);
  const [allChannelData, setAllChannel] = React.useState({});
  const [videoList, setVideoList] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [isUploaded, setIsUploaded] = React.useState([]);

  const channelCollectionRef = collection(db, "channels");

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(channelCollectionRef);

      const dataReq = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAllChannel(dataReq);
    };

    fetchData();
  }, []);

  const videosCollectionRef = collection(db, "videos");

  console.log(isUploaded)

  React.useEffect(() => {
    const getVideoList = async () => {
      try {
        const data = await getDocs(videosCollectionRef);
        const dataReq = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setVideoList(dataReq);

        setLoader(false);
      } catch (err) {
        console.log(err);
      }
    };
    getVideoList();
  }, [isUploaded]);

  let videosToDisplay;

  if (search) {
    videosToDisplay = videoList.filter((video) => {
      const hasMatchingTag = video.tags?.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );

      const hasMatchingTitle = video.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return hasMatchingTag || hasMatchingTitle;
    });
  } else {
    videosToDisplay = videoList;
  }

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="app--container">
      <videoContext.Provider value={videoList} >
        <channelContext.Provider value={allChannelData}>
          <Menu />
          <div className="app--main">
            <Navbar search={search} setSearch={setSearch} setIsUploaded={setIsUploaded} />
            <div className="app--wrapper">
              <Routes>
                <Route path="/">
                  <Route index element={<Home videoList={videosToDisplay} />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/your-channel" element={<YourChannel isUploaded={isUploaded}/>} />
                  <Route path="/channel/:channelName" element={<Channel />} />
                  <Route path="/subscribtions" element={<Subscribtions />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </div>
          </div>
        </channelContext.Provider>
      </videoContext.Provider>
    </div>
  );
}

export default App;
