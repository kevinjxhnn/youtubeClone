import React from "react";
import { channelContext, videoContext } from "../Components/App";
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import VideoCard from "../Components/VideoCard";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import Loader from "../Components/Loader";

const Channel = () => {
  const [videoList, setVideoList] = React.useState();
  const [loader, setLoader] = React.useState(true);
  const [currentChannel, setCurrentChannel] = React.useState();
  const [subscribedCount, SetSubscriberCount] = React.useState();
  const videoContextData = React.useContext(videoContext);
  const channelContextData = React.useContext(channelContext);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const { channelName } = useParams();

  const userCollectionRef = doc(db, "users", localStorage.getItem("email"));
  const channelsCollectionRef = doc(db, "channels", channelName);

  const handleSubscribe = async () => {
    const userDoc = await getDoc(userCollectionRef);
    const channelDoc = await getDoc(channelsCollectionRef);

    setIsSubscribed(true);

    if (userDoc.exists()) {
      await setDoc(
        userCollectionRef,
        {
          subscribed: arrayUnion(channelName),
        },
        { merge: true }
      );
    } else {
      await setDoc(userCollectionRef, {
        subscribed: [channelName],
      });
    }

    if (channelDoc.exists()) {
      let count = channelDoc.data().subscribers;
      SetSubscriberCount(count + 1);

      await updateDoc(channelsCollectionRef, {
        subscribers: count + 1,
      });
    }
  };

  const handleUnsubscribe = async () => {
    const userDoc = await getDoc(userCollectionRef);
    const channelDoc = await getDoc(channelsCollectionRef);

    setIsSubscribed(false);

    if (userDoc.exists()) {
      if (userDoc.data().subscribed?.includes(channelName)) {
        await setDoc(
          userCollectionRef,
          {
            subscribed: arrayRemove(channelName),
          },
          { merge: true }
        );
      }
    }

    if (channelDoc.exists()) {
      let count = channelDoc.data().subscribers;
      SetSubscriberCount(count - 1);
      await updateDoc(channelsCollectionRef, {
        subscribers: count - 1,
      });
    }
  };

  React.useEffect(() => {
    const checkSubscription = async () => {
      const userDoc = await getDoc(userCollectionRef);
      if (userDoc.exists() && userDoc.data().subscribed?.includes(channelName)) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }

      setLoader(false)
    };

    checkSubscription();
  }, [subscribedCount]);

  React.useEffect(() => {
    const channelArray = Array.isArray(channelContextData)
      ? channelContextData
      : [];

    const currentChannel = channelArray.find((item) => item.id == channelName);
    setCurrentChannel(currentChannel);
    SetSubscriberCount(currentChannel.subscribers);
    

    const filteredVideos = videoContextData.filter(
      (video) => video.channel_id === channelName
    );
    setVideoList(filteredVideos);
    
  }, [channelContextData, channelName, videoContextData, currentChannel]);

  let id = 0;

  const videoListElements = videoList?.map((item) => (
    <VideoCard key={id++} type="normal" item={item} />
  ));

  if (loader) {
    return <Loader />;
  }

  return (
    <div>
      <div className="your-channel--wrapper">
        <div className="your-channel--main" style={{ padding: "5px" }}>
          <Avatar
            sx={{ width: 110, height: 110, marginTop: "20px" }}
            alt="profile pic"
            src={currentChannel?.channel_profile_pic}
          />

          <div className="your-channel--content">
            <h3>{currentChannel?.id}</h3>
            <h4>@{currentChannel?.id}</h4>
            <h5> {subscribedCount} subscribers</h5>
          </div>
        </div>
        {!isSubscribed && (
          <button onClick={handleSubscribe} className="subscribe channel">
            Subscribe
          </button>
        )}
        {isSubscribed && (
          <button onClick={handleUnsubscribe} className="unsubscribe channel">
            Unsubscribe
          </button>
        )}
      </div>
      <hr style={{ marginTop: "30px" }} className="menu--item-hr" />

      <h2 className="channel--subtitle" style={{ padding: "5px" }}>
        All videos...
      </h2>
      <div className="home--container" style={{ marginTop: "30px" }}>
        {videoListElements}
      </div>
    </div>
  );
};

export default Channel;
