import React from 'react';
import ReactDOM from 'react-dom';
import Loader from '../ui/loader/Loader';

const LoadingPortal = ({theme}) => {
  const loadingDiv = document.getElementById('layout-for-loading');

  return ReactDOM.createPortal(
    <><Loader theme={theme}/></>,
    loadingDiv
  );
};

export default LoadingPortal;