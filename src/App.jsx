import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { MainLayout } from "./presentation/shared/layout/MainLayout";
import { AppRoutes } from "./presentation/routes/AppRoutes";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
};


export default App;
