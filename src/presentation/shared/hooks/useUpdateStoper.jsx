import { stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useUpdateStoper = ({ change, setErr }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(stop());
    setErr("");
  }, [change]);
};

export default useUpdateStoper;
