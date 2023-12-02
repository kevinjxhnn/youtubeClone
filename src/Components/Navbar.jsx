import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
  LinearProgress,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app, db } from "../services/Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = (prop) => {
  const navigate = useNavigate();

  function handleClick() {
    localStorage.clear();
    window.location.reload();
  }

  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [img, setImg] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [imgPerc, setImgPerc] = React.useState(0);
  const [videoPerc, setVideoPerc] = React.useState(0);
  const [inputs, setInputs] = React.useState({});
  const [tags, setTags] = React.useState([]);

  

  const handleChange = (e) => {
    setInputs((prevInputs) => {
      return { ...prevInputs, [e.target.name]: e.target.value };
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInputs({});
    setTags([]);
    setImgPerc(0);
    setVideoPerc(0);
  };

  const handleTags = (event) => {
    setTags(event.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");

        urlType == "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setInputs((prevInputs) => {
            return {
              ...prevInputs,
              [urlType == "imgUrl" ? "thumbnail" : "video"]: downloadURL,
              published: serverTimestamp(),
            };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const uploadsCollectionRef = collection(db, "videos");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !inputs.title ||
      !inputs.description ||
      tags.length === 0 ||
      !img ||
      !video
    ) {
      setErrorOpen(true);
      return;
    }

    try {
      await addDoc(uploadsCollectionRef, {
        ...inputs,
        tags,
        channel_id: localStorage.getItem("channelName"),
      });

      setSuccessOpen(true);
      setOpen(false);
      setInputs({});
      setTags([]);
      setImgPerc(0);
      setVideoPerc(0);
      prop.setIsUploaded((prev) => [...prev, "uploaded"])
      navigate("/your-channel");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = React.useCallback(
    (e) => {
      prop.setSearch(e.target.value);
    },
    [prop.search]
  );

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      navigate("/");
    }
  };

  return (
    <>
      <div className="navbar--container">
        <div className="navbar--wrapper">
          <div className="navbar--search-container">
            <input
              className="navbar--input"
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              onKeyDown={handleEnter}
            />
            <SearchIcon />
          </div>

          <div className="navbar--button-container">
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {!localStorage.getItem("email") && (
                <Button>
                  <AccountCircleIcon /> Sign In
                </Button>
              )}
            </Link>

            {/* Upload button */}
            {localStorage.getItem("name") && (
              <Button
                onClick={
                  localStorage.getItem("hasChannel") === "false"
                    ? () => navigate("/your-channel")
                    : handleClickOpen
                }
                className="video-upload"
                sx={{
                  border: "none !important",
                  color: "#373737 !important",
                  marginRight: "5px",
                }}
              >
                <VideoCallIcon />
              </Button>
            )}

            {localStorage.getItem("name") && (
              <Button
                sx={{
                  color: "#373737  !important",
                  borderColor: "#373737  !important",
                }}
                onClick={handleClick}
              >
                Log out <ExitToAppIcon />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <VideoCallIcon /> Upload Video
        </DialogTitle>
        <DialogContent>
          {/* Video */}
          {videoPerc == 0 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Please select the video to upload.
            </InputLabel>
          )}

          {videoPerc > 0 && videoPerc < 100 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Uploading...
            </InputLabel>
          )}

          {videoPerc == 100 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Video uploaded successfully.
            </InputLabel>
          )}

          {videoPerc > 0 ? (
            <LinearProgress variant="determinate" value={videoPerc} />
          ) : (
            <Input
              required
              autoFocus
              variant="filled"
              id="video"
              type="file"
              fullWidth
              sx={{ marginTop: "5px" }}
              onChange={(e) => {
                setVideo(e.target.files[0]);
              }}
            />
          )}

          {/* Title */}
          <TextField
            required
            id="title"
            type="text"
            placeholder="Enter the title"
            fullWidth
            variant="outlined"
            sx={{ marginTop: "40px" }}
            name="title"
            onChange={handleChange}
          />

          {/* Description */}
          <TextField
            id="description"
            type="text"
            required
            placeholder="Enter the description for the video"
            fullWidth
            variant="outlined"
            multiline
            sx={{ marginTop: "20px" }}
            rows={5}
            name="description"
            onChange={handleChange}
          />

          {/* Tags */}
          <TextField
            id="tags"
            type="text"
            required
            placeholder="Enter the tags, separated buy commas"
            fullWidth
            variant="outlined"
            sx={{ marginTop: "20px" }}
            onChange={(e) => handleTags(e)}
          />

          {/* Thumbnail */}

          {imgPerc == 0 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Please select the thumbnail to upload.
            </InputLabel>
          )}

          {imgPerc > 0 && imgPerc < 100 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Uploading...
            </InputLabel>
          )}

          {imgPerc == 100 && (
            <InputLabel
              htmlFor="file"
              sx={{ marginTop: "20px", fontSize: "14px" }}
            >
              Thumbnail uploaded successfully.
            </InputLabel>
          )}

          {imgPerc > 0 ? (
            <LinearProgress variant="determinate" value={imgPerc} />
          ) : (
            <Input
              autoFocus
              required
              variant="filled"
              id="thumbnail"
              type="file"
              fullWidth
              sx={{ marginTop: "5px" }}
              onChange={(e) => {
                setImg(e.target.files[0]);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpload}>Upload</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <>
        <Snackbar
          open={errorOpen}
          autoHideDuration={4000}
          onClose={() => setErrorOpen(false)}
          sx={{ marginLeft: "40%" }}
        >
          <Alert onClose={() => setErrorOpen(false)} severity="error">
            Please fill all the details!
          </Alert>
        </Snackbar>
      </>

      <>
        <Snackbar
          open={successOpen}
          autoHideDuration={4000}
          onClose={() => setSuccessOpen(false)}
          sx={{ marginLeft: "40%" }}
        >
          <Alert onClose={() => setSuccessOpen(false)} severity="success">
            Video successfully uploaded!
          </Alert>
        </Snackbar>
      </>
    </>
  );
};

export default Navbar;
