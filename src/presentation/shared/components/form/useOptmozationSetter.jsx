import React, { useEffect } from "react";

const useOptmozationSetter = ({
  setLoad = () => {},
  change,
  prevChange,
  setLastChange,
}) => {
  useEffect(() => {
    setLoad(true);
    const timeOut = setTimeout(() => {
      if (change !== prevChange.current) {
        prevChange.current = change;
        setLastChange(change);
      } else setLoad(false);
    }, 1500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [change]);
};

export default useOptmozationSetter;
