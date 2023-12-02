import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import NewComment from "../Components/NewComment";
import Comment from "../Components/Comment";
import Avatar from "@mui/material/Avatar";
import { Link, useParams } from "react-router-dom";
import { db } from "../services/Firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { videoContext } from "../Components/App";
import VideoCard from "../Components/VideoCard";
import Loader from "../Components/Loader";

const Video = () => {
  const videoContextData = React.useContext(videoContext);
  const [loader, setLoader] = React.useState(true);
  const [likeCount, setLikeCount] = React.useState();
  const [videoData, setVideoData] = React.useState({});
  const [currentChannel, setCurrentChannel] = React.useState({});
  const { id } = useParams();
  const currentVideoTags = videoData.tags;
  const [commentList, setCommentList] = React.useState();
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [subscribedCount, SetSubscriberCount] = React.useState();
  const commentsCollectionRef = collection(db, "comments");
  const videosCollectionRef = doc(db, "videos", id);
  const [commentAdded, setCommentAdded] = React.useState([]);
  const [isLiked, setIsLiked] = React.useState(false);

  let userCollectionRef;

  if (localStorage.getItem("email")) {
    userCollectionRef = doc(db, "users", localStorage.getItem("email"));
  }

  const [currentChannelName, setCurrentChannelName] = React.useState(null);

  let channelsCollectionRef;

  if (currentChannelName) {
    channelsCollectionRef = doc(db, "channels", currentChannelName);
  }

  const handleLike = async () => {
    try {
      const videoRef = doc(db, "videos", videoData.id);
      const userDoc = await getDoc(userCollectionRef);

      setIsLiked(true);

      await updateDoc(videoRef, {
        likes: increment(1),
      });

      if (userDoc.exists()) {
        await setDoc(
          userCollectionRef,
          {
            liked: arrayUnion(videoData.id),
          },
          { merge: true }
        );
      } else {
        await setDoc(userCollectionRef, {
          liked: [videoData.id],
        });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const videoRef = doc(db, "videos", videoData.id);
      const userDoc = await getDoc(userCollectionRef);

      const videoDoc = await getDoc(videoRef);
      const count = videoDoc.data().likes;

      setIsLiked(false);

      await updateDoc(videoRef, {
        likes: count - 1,
      });

      if (userDoc.exists()) {
        if (userDoc.data().liked?.includes(videoData.id)) {
          await setDoc(
            userCollectionRef,
            {
              liked: arrayRemove(videoData.id),
            },
            { merge: true }
          );
        }
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSubscribe = async () => {
    const userDoc = await getDoc(userCollectionRef);
    const channelDoc = await getDoc(channelsCollectionRef);

    setIsSubscribed(true);

    if (userDoc.exists()) {
      await setDoc(
        userCollectionRef,
        {
          subscribed: arrayUnion(currentChannelName),
        },
        { merge: true }
      );
    } else {
      await setDoc(userCollectionRef, {
        subscribed: [currentChannelName],
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
      if (userDoc.data().subscribed?.includes(currentChannelName)) {
        await setDoc(
          userCollectionRef,
          {
            subscribed: arrayRemove(currentChannelName),
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
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await getDocs(commentsCollectionRef);
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommentList(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id, setCommentList, commentAdded]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const video = await getDoc(videosCollectionRef);
        if (video.exists()) {
          setVideoData({ ...video.data(), id: video.id });

          const channelRef = doc(db, "channels", video.data().channel_id);
          const channelDoc = await getDoc(channelRef);

          if (channelDoc.exists()) {
            setCurrentChannel({ id: channelDoc.id, ...channelDoc.data() });
            setCurrentChannelName(channelDoc.id);
            SetSubscriberCount(channelDoc.data().subscribers);
          }

          setLikeCount(video.data().likes);
          setLoader(false);

          const userDoc = await getDoc(userCollectionRef);
          if (
            userDoc.exists() &&
            userDoc.data().subscribed?.includes(currentChannelName)
          ) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }

          if (userDoc.exists() && userDoc.data().liked?.includes(video.id)) {
            setIsLiked(true);
          } else {
            setIsLiked(false);
          }
        } else {
          console.log("Video not found.");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [id, currentChannelName, isLiked, likeCount, subscribedCount]);

  const filteredVideos = videoContextData
    .filter((video) =>
      video.tags.some((trimmedTag) => currentVideoTags?.includes(trimmedTag))
    )
    .filter((video) => video.id !== id);

  const videoListElements = filteredVideos.map((item) => (
    <div key={item.id}>
      <VideoCard type="normal" item={item} size="small" />
    </div>
  ));

  const filteredComments = commentList?.filter(
    (comment) => comment.video_id === id
  );

  const commentsElement = filteredComments?.map((commentsData) => (
    <Comment key={commentsData.id} commentsData={commentsData} />
  ));

  if (loader) {
    return <Loader />;
  }

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

        <div className="video--details">
          <h1 className="video--title">{videoData.title}</h1>
        </div>

        <hr
          className="video--hr"
          style={{ marginBottom: "5px", border: "none" }}
        />
        <div className="video--channel">
          {localStorage.getItem("email") && (
            <Link
              to={`/channel/${videoData?.channel_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
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
                    {subscribedCount} subscribers
                  </span>
                </div>
              </div>
            </Link>
          )}

          {!localStorage.getItem("email") && (
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
                  {subscribedCount} subscribers
                </span>
              </div>
            </div>
          )}

          {localStorage.getItem("email") && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="video--button-container">
                {!isLiked && (
                  <>
                    <p className="like-counter">{likeCount}</p>
                    <button onClick={handleLike}>
                      <ThumbUpIcon />
                    </button>
                  </>
                )}

                {isLiked && (
                  <>
                    <p className="like-counter">{likeCount}</p>
                    <button onClick={handleUnlike}>
                      <ThumbUpIcon sx={{ color: "#cc1a00" }} />
                    </button>
                  </>
                )}
              </div>

              {!isSubscribed && (
                <button onClick={handleSubscribe} className="subscribe">
                  Subscribe
                </button>
              )}
              {isSubscribed && (
                <button onClick={handleUnsubscribe} className="unsubscribe">
                  Unsubscribe
                </button>
              )}
            </div>
          )}
        </div>
        <p className="video--description">{videoData.description}</p>
        <hr className="video--hr" style={{ marginTop: "10px" }} />

        <h3 style={{ margin: "20px 0" }}>Comments</h3>

        {localStorage.getItem("email") && (
          <NewComment id={videoData.id} setCommentAdded={setCommentAdded} />
        )}
        {commentsElement}
      </div>
      <div className="video--recommendation">{videoListElements}</div>
    </div>
  );
};

export default Video;
