import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import PortraitIcon from "@mui/icons-material/Portrait";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import img from "../images/logo.png";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Menu = () => {
  return (
    <div className="menu--container">
      <div className="menu--wrapper">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="menu--logo-container">
            <img src={img} alt="youtube icon" />
            YouTube
            <sup className="sup">IN</sup>
          </div>
          <div className="menu--item">
            <HomeIcon />
            Home
          </div>
        </Link>

        <Link
          to={localStorage.getItem("email") ? "/subscribtions" : "/signin"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="menu--item">
            <SubscriptionsIcon />
            Subscriptions
          </div>
        </Link>
        <hr className="menu--item-hr" />

        {!localStorage.getItem("email") && (
          <>
            <Link
              to="/signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="menu--login-container">
                Sign in to like videos, comment and subscribe.
                <Button>
                  <AccountCircleIcon /> Sign In
                </Button>
              </div>
            </Link>

            <hr className="menu--item-hr" />
          </>
        )}

        {localStorage.getItem("name") && (
          <>
            <div className="menu--name">
              <div>
                <img
                  src={localStorage.getItem("profilePic")}
                  alt="profile pic"
                />
              </div>
              <div>Welcome {localStorage.getItem("name").split(" ")[0]}!</div>
            </div>
            <hr className="menu--item-hr" />
          </>
        )}

        <Link
          to={localStorage.getItem("email") ? "/your-channel" : "/signin"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="menu--item">
            <PortraitIcon />
            Your Channel
          </div>
        </Link>
        <hr className="menu--item-hr" />
      </div>
    </div>
  );
};

export default Menu;
