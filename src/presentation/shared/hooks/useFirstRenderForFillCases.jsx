import { clearCases } from "@data/storage/storeRx/problemSlices/sliceForfillTestCases";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { clearCases } from '../@data/storage/storeRx/sliceForfillTestCases';

const useFirstRenderForFillCases = ({ setFirstRender }) => {
  const fillCases = useSelector((state) => state.sliceForfillTestCases.fill);
  const dispatch = useDispatch();
  useEffect(() => {
    if (fillCases) {
      dispatch(clearCases());
      setFirstRender(true);
    }
  }, []);
};

export default useFirstRenderForFillCases;
