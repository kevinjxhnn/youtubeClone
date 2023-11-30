import React from "react";
import youtube from "../images/YouTube-Logo.wine.svg";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { signInWithGoogle } from "../services/Firebase";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();

  return (
    <div className="signin--container">
      <Card variant="elevation" className="signin--wrapper">
        <CardMedia
          component="img"
          height="140"
          className="signin--image"
          src={youtube}
          alt=""
        />

        <h1 className="signin--title">Sign In</h1>
        <h2 className="signin--subtitle">to use all the features of youtube</h2>
        <div className="signin--button-div">
          <button
            type="button"
            class="login-with-google-btn"
            onClick={() => signInWithGoogle(navigate)}
          >
            Sign in with Google
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Signin;
