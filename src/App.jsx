import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { MainLayout } from "./presentation/shared/layout/MainLayout";
import { AppRoutes } from "./presentation/routes/AppRoutes";


const App = () => {
  useEffect(()=>{
  
    const temeout = setTimeout(() => {
      
      fetch("http://localhost:1338/api/recommendations/suggest",{
        credentials:"include"
      }).then(res => res.json()).then(data => console.log(data))
    }, 6000);
    return () => clearTimeout(temeout);
  },[])
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
};


export default App;
