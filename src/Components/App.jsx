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
import Channel from "../Pages/Channel";

export const channelContext = React.createContext();

function App() {
  const [allChannelData, setAllChannel] = React.useState({});
  const [videoList, setVideoList] = React.useState([]);
  const [search, setSearch] = React.useState();

  console.log("search", search);

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

  React.useEffect(() => {
    const getVideoList = async () => {
      try {
        const data = await getDocs(videosCollectionRef);
        const dataReq = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setVideoList(dataReq);
      } catch (err) {
        console.log(err);
      }
    };
    getVideoList();
  }, []);

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

  return (
    <div className="app--container">
      <channelContext.Provider value={allChannelData}>
        <Menu />
        <div className="app--main">
          <Navbar search={search} setSearch={setSearch} />
          <div className="app--wrapper">
            <Routes>
              <Route path="/">
                <Route index element={<Home videoList={videosToDisplay} />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/your-channel" element={<Channel />} />
                <Route path="video">
                  <Route
                    path=":id"
                    element={<Video allChannelData={allChannelData} />}
                  />
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </channelContext.Provider>
    </div>
  );
}

export default App;
