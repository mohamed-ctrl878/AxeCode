import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MainLayout } from "./presentation/shared/layout/MainLayout";
import { AppRoutes } from "./presentation/routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
};


export default App;
