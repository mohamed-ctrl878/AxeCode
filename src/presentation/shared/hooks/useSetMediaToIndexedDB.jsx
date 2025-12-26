import React, { useEffect, useRef } from "react";
import { set, del } from "idb-keyval";
import { go, stop } from "@data/storage/storeRx/sharedSlices/validStarter";
const useSetMediaToIndexedDB = ({
  dispatch,
  value,
  fieldName,
  setError,
  errorMessage,
  setProberty,
}) => {
  const oldId = useRef(null);

  useEffect(() => {
    console.log(value);
    // if (value) return;
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    if (value !== null) {
      set(id, value);
      dispatch(setProberty({ [fieldName]: id }));
      dispatch(go());
    } else {
      setError(errorMessage);
      dispatch(stop());
    }

    return () => {
      if (oldId.current) {
        del(oldId.current);
      }
      oldId.current = id;
    };
  }, [value]);
};

export default useSetMediaToIndexedDB;
