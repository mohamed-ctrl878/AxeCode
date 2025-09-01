import React, { useEffect } from "react";
import erer from "@presentation/assets/images/error.webp";
import { useDispatch } from "react-redux";
import { switchState } from "@data/storage/storeRx/globalStore/themeSlice";
// import { switchState } from "../@data/storage/storeRx/themeSlice";

const ErrComponent = ({ theme, loader }) => {
  const switchTheme = useDispatch();

  useEffect(() => {
    if (loader == false) switchTheme(switchState(true));
  }, [theme]);
  return (
    <div className="error-page">
      <img src={erer} alt="error" />
      <h2>Page Not Found</h2>
      <p>
        The page or route you are trying to access does not exist. Please check
        the URL or go back to the homepage.
      </p>
    </div>
  );
};

export default ErrComponent;
