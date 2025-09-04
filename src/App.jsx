import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faLaptopCode,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
// import { getMyDataExe } from "./api/userData";
// import { setUserDataHere } from "./store/slices/userDataSlice";
import "./App.css";

import GetMyData from "@data/repositories/userImps/GetMyData";
import getMyDataExe from "@domain/usecases/user/getMyDataExe";
import ScrollToTop from "@presentation/shared/components/layout/ScrollToTop";
import { setUserDataHere } from "@data/storage/storeRx/globalStore/userData";
import Layout from "@presentation/shared/components/layout/Layout";
import Header from "@presentation/shared/components/layout/LinkHeader";
import { routes } from "./routes";
const AppRoutes = ({ data, theme, themeClass }) => {
  return useRoutes(routes(data, theme, themeClass));
};

const App = React.memo(() => {
  const theme = useSelector((state) => state.themeSlice.theme);
  const data = useSelector((state) => state.userData.data);
  const themeClass = theme ? "dark-theme" : "light-theme";
  // console.log(data);
  const auth = useSelector((state) => state.auth.getuserData);
  const dispatch = useDispatch();

  const info = <FontAwesomeIcon icon={faSitemap} />;
  const world = <FontAwesomeIcon icon={faGlobe} />;
  const codeIcon = <FontAwesomeIcon icon={faLaptopCode} />;

  const [black, setBlack] = useState(false);
  const [loader, setLoader] = useState(true);
  const [err, setErr] = useState(null);

  async function myData() {
    setLoader(true);
    try {
      const dataUser = await getMyDataExe(new GetMyData());
      setLoader(false);
      dispatch(setUserDataHere(dataUser));
    } catch (c) {
      setErr(c.message);
      setLoader(false);
    }
  }

  // Get theme class

  useEffect(() => {
    myData();
  }, []);

  useEffect(() => {
    if (auth) myData();
  }, [auth]);

  return (
    <div className={themeClass}>
      <Router>
        <ScrollToTop />
        <Header data={data} theme={theme} />
        <Layout theme={theme}>
          <AppRoutes data={data} theme={theme} themeClass={themeClass} />
          <div className={`background-lights ${themeClass}`} />
        </Layout>
      </Router>
    </div>
  );
});

export default App;
