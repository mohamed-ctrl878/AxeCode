import React, { useEffect, useState } from "react";
import style from "@presentation/styles/pages/home-new.module.css";
import { Link } from "react-router-dom";
import PinedPosts from "../components/PinedPosts";
import Feedback from "@presentation/shared/components/feedback/Feedback";
import HeroSec from "../components/HeroSec";
// import HeroSec from "@home/components/HeroSec";
// import PinedPosts from "@shared/components/ui/PinedPosts";
// import Feedback from "@feedback/Feedback";
// import ThemeTest from "@ui/ThemeTest";

const Home = React.memo(({ theme, auth }) => {
  // const [mood, setmood] = useState(
  //   theme.includes("dark") ? "dark-theme" : "light-theme"
  // );

  // useEffect(() => {
  //   theme.includes("dark") ? setmood("dark-theme") : setmood("light-theme");
  // }, [theme]);

  return (
    <div className={`${style.homeContainer} ${"mood"}`}>
      <HeroSec theme={theme} style={style} />

      <PinedPosts theme={theme} mood={"mood"} style={style}></PinedPosts>
      <Feedback mood={"mood"} style={style}></Feedback>
    </div>
  );
});

export default Home;
