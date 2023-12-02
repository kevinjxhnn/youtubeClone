import React from "react";
import VideoCard from "../Components/VideoCard";
import { db } from "../services/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Card, CardMedia } from "@mui/material";
import novideo from "../images/sadface.png";
import Loader from "../Components/Loader";


const Subscribtions = () => {
  const [videoList, setVideoList] = React.useState();
  const [loader, setLoader] = React.useState(true);


  const userEmail = localStorage.getItem("email");
  const userDocRef = doc(db, "users", userEmail);

  React.useEffect(() => {
    const fetchData = async () => {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const subscribedChannels = userDoc.data().subscribed;

        if (subscribedChannels && subscribedChannels.length > 0) {
          const videosQuery = query(
            collection(db, "videos"),
            where("channel_id", "in", subscribedChannels)
          );

          try {
            const querySnapshot = await getDocs(videosQuery);

            const subscribedVideos = [];
            querySnapshot.forEach((doc) => {
              subscribedVideos.push({ id: doc.id, ...doc.data() });
            });

            console.log("Subscribed Videos:", subscribedVideos);

            setVideoList(subscribedVideos);
            
          } catch (error) {
            console.error("Error fetching subscribed videos:", error);
          }
          
        } else {
          console.log("No subscribed channels");
          setVideoList([]);
        }

        setLoader(false)
      }
    };

    fetchData();
  }, [userDocRef]);

  let id = 0;
  const videoListElements = videoList?.map((item) => (
    <VideoCard key={id++} type="normal" item={item} />
  ));

  if (loader) {
    return <Loader />;
  }


  return (
    <>
      <div>
        <h2 className="subscriptions--title" style={{ padding: "5px" }}>
          Your Subscriptions
        </h2>
        <div className="home--container" style={{ marginTop: "30px" }}>
          {videoListElements}
        </div>
      </div>

      {videoList?.length === 0 && (
        <div className="channel--container">
          <Card
            variant="outline"
            sx={{ background: "#f9f9f9", marginTop: "-350px" }}
            className="signin--wrapper"
          >
            <CardMedia
              component="img"
              height="140"
              className="signin--image"
              src={novideo}
              alt=""
              style={{
                width: "auto",
                height: "100px",
                display: "block",
                margin: "0 auto",
                padding: "10px",
              }}
            />

            <h1 className="signin--title" style={{ marginTop: "10px" }}>
              No Video Found!
            </h1>
            <h2 className="signin--subtitle">
              Subscribe to creators to view the video here
            </h2>
          </Card>
        </div>
      )}
    </>
  );
};

export default Subscribtions;
