import React from "react";
import VideoCard from "../Components/VideoCard";
import { db } from "../services/Firebase";
import {
  getDocs,
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Avatar, Button, Card, TextField } from "@mui/material";
import youtube from "../images/YouTube-Logo.wine.svg";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import novideo from "../images/sadface.png";
import Loader from "../Components/Loader";

const Channel = (prop) => {
  const [channelName, setChannelName] = React.useState([]);
  const [openChannelDialog, setOpenChannelDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenChannelDialog(true);
  };

  const handleClose = () => {
    setOpenChannelDialog(false);
  };

  const channelsCollectionRef = collection(db, "channels");
  const userCollectionRef = collection(db, "users");
  const [loader, setLoader] = React.useState(true);

  const handleConfirm = async () => {
    try {
      const channelId = channelName;

      const existingDoc = await getDoc(doc(channelsCollectionRef, channelId));

      if (existingDoc.exists()) {
        throw new Error("Channel with this name already exists");
      }

      await setDoc(doc(channelsCollectionRef, channelId), {
        channel_profile_pic: localStorage.getItem("profilePic"),
        subscribers: 0,
      });

      handleClose();

      const userId = localStorage.getItem("email");

      await updateDoc(doc(userCollectionRef, userId), {
        has_channel: true,
        channel_name: channelId,
      });

      localStorage.setItem("hasChannel", "true");
      localStorage.setItem("channelName", channelId);

      window.location.reload();
    } catch (err) {
      console.error("Error adding channel:", err.message);
    }
  };

  const [videoList, setVideoList] = React.useState([]);
  const videosCollectionRef = collection(db, "videos");



  React.useEffect(() => {
    const getVideoList = async () => {
      try {
        const data = await getDocs(videosCollectionRef);

        const channelName = localStorage.getItem("channelName");
        const filteredData = data.docs
          .filter((doc) => doc.data().channel_id === channelName)
          .map((doc) => ({ ...doc.data(), id: doc.id }));

        setVideoList(filteredData);
        
      } catch (err) {
        console.log(err);
      }
      setLoader(false);
    };
    getVideoList();
  }, [prop.isUploaded]);


  const videoListElements = videoList.map((item) => (
    <VideoCard type="normal" item={item} page="user"/>
  ));

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      {localStorage.getItem("hasChannel") == "false" && (
        <div className="channel--container">
          <Card variant="elevation" className="signin--wrapper">
            <CardMedia
              component="img"
              height="140"
              className="signin--image"
              src={youtube}
              alt=""
            />

            <h1 className="signin--title">Create your Channel!</h1>
            <h2 className="signin--subtitle">
              Upload videos to your channel and more.
            </h2>
            <div className="signin--button-div">
              <Button
                onClick={handleClickOpen}
                variant="contained"
                sx={{
                  backgroundColor: "#ff0000",
                  marginTop: "20px",
                  marginButton: "10px",
                  "&:hover": {
                    backgroundColor: "#ff0000",
                  },
                }}
              >
                Get started
              </Button>
            </div>
          </Card>
        </div>
      )}

      {localStorage.getItem("hasChannel") == "true" && (
        <div>
          <div className="your-channel--main" style={{ padding: "5px" }}>
            <Avatar
              sx={{ width: 110, height: 110, marginTop: "20px" }}
              alt="profile pic"
              src={localStorage.getItem("profilePic")}
            />

            <div className="your-channel--content">
              <h3>{localStorage.getItem("name")}</h3>
              <h4>@{localStorage.getItem("channelName")}</h4>
            </div>
          </div>
          <hr style={{ marginTop: "30px" }} className="menu--item-hr" />

          <h2 className="channel--subtitle">All your uploads...</h2>
          <div className="home--container" style={{ marginTop: "30px" }}>
            {videoListElements}
          </div>

          {videoListElements.length == 0 && (
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
                  Upload a video to view them here.
                </h2>
              </Card>
            </div>
          )}
        </div>
      )}
      <Dialog open={openChannelDialog} onClose={handleClose}>
        <DialogTitle sx={{ paddingRight: "30px" }}>
          What would be the name of the channel?
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Channel Name"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => setChannelName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Channel;
