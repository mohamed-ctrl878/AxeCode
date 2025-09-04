import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import style from "../../../styles/components/header.module.css";
import cat from "@assets/images/cat.webp";
import { faGear, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import logout from "../utils/logout";

import { useSelector, useDispatch } from "react-redux";
import { switchState } from "@data/storage/storeRx/globalStore/themeSlice";
import { logOut } from "@data/storage/storeRx/globalStore/userAuthSlice";

const ProfileBar = React.memo(
  ({ prof, mood, setGetUserData, userState, data, setProfile }) => {
    const theme = useSelector((state) => state.themeSlice.theme);

    const switchTheme = useDispatch();
    const moonElement = <FontAwesomeIcon icon={faMoon} />;
    const [hover, setHover] = useState(
      mood === "bakground-dark-theme"
        ? "active-hover-dark"
        : "active-hover-light"
    );
    useEffect(() => {
      setHover(
        mood === "bakground-dark-theme"
          ? "active-hover-dark"
          : "active-hover-light"
      );
    }, [mood]);
    const navgate = useNavigate("");

    return (
      <>
        <div className={`${mood} ${""}`}>
          {data && (
            <>
              {" "}
              <Link
                onClick={() => setProfile((e) => !e)}
                to={"/settings/profile"}
              >
                <img
                  width={"50px"}
                  height={"50px"}
                  src={`${
                    data && data.avatar
                      ? "http://localhost:1338" + data.avatar.url
                      : cat
                  }`}
                  alt="profile"
                />
              </Link>
              <span>{data && data.username}</span>
            </>
          )}
          <section>
            <button
              aria-label="sellecor-theme"
              className={`${hover} ${"mood-btn"}`}
              onClick={() => {
                // console.log("fll");
                switchTheme(switchState());
                setProfile((e) => !e);
              }}
            >
              {moonElement}
            </button>

            {!data ? (
              <>
                <Link onClick={() => setProfile((e) => !e)} to={"/login"}>
                  Login
                </Link>
                <Link onClick={() => setProfile((e) => !e)} to={"/register"}>
                  Regiser
                </Link>
              </>
            ) : (
              <div>
                <Link onClick={() => setProfile((e) => !e)} to="/settings">
                  <FontAwesomeIcon icon={faGear} />
                </Link>
                <button
                  className="lgot"
                  onClick={() => {
                    logOut();
                    setProfile((e) => !e);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </section>
        </div>
        <div onClick={() => setProfile((e) => !e)} className={""}></div>
      </>
    );
  }
);

export default ProfileBar;
