import React from 'react';
import './Loader.css';
import axe from '@presentation/assets/icons/axe.svg'
const Loader = ({theme}) => {
  return (<>
    <div className="loader-container">
      <img src={axe} className="spinner"></img>
    </div>
    <div className={`${theme} lay`}></div>
  </>
  );
};

export default Loader;
