import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Input from "@mui/material/Input";
import { serverTimestamp } from "firebase/firestore";
import { db } from "../services/Firebase";
import { addDoc, collection } from "firebase/firestore";

const NewComment = (prop) => {
  const [newComment, setNewComment] = useState("");

  const channel_id = localStorage.getItem("channelName");
  const content = newComment;
  const video_id = prop.id;
  const published = serverTimestamp();

  const commentsCollectionRef = collection(db, "comments");

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      try {
        await addDoc(commentsCollectionRef, {
          content: content,
          channel_id: channel_id,
          video_id: video_id,
          published: published,
          channel_profile_pic: localStorage.getItem("profilePic"),
        });

        setNewComment("");

        prop.setCommentAdded((prev) => [...prev, "added"])

      } catch (error) {
        console.error("Error adding document:", error);
      }
    }
  };



  return (
    <div className="comment--container">
      <div className="comment--new-comment">
        <Avatar
          sx={{ width: 40, height: 40 }}
          alt="profile pic"
          src={localStorage.getItem("profilePic")}
        />

        <Input
          className="comment--input"
          placeholder="Add a comment..."
          type="text"
          sx={{ borderColor: "#ccc" }}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleEnter}
          value={newComment}
        />
      </div>
    </div>
  );
};

export default NewComment;
