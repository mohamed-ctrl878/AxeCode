import { stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useHndillerRigisterInfo = (data, setToStore, validFunction, setError) => {
  const dispatch = useDispatch();
  const start = useSelector((state) => state.validStarter.start);
  console.log("fire");
  useEffect(() => {
    if (start) {
      try {
        const validData = validFunction(JSON.parse(data));
        dispatch(setToStore(validData));
      } catch (e) {
        dispatch(stop());
        setError(e.message);
      }
    }
  }, [data, start, setToStore, validFunction, setError, dispatch]);
};

export default useHndillerRigisterInfo;
