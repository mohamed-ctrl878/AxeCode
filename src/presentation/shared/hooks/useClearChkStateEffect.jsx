// import { clearCases } from "@/data/storage/storeRx/sliceForfillTestCases";
import { clearCases } from "@data/storage/storeRx/problemSlices/sliceForfillTestCases";
import React, { useEffect } from "react";
// import { clearCases } from "../@data/storage/storeRx/sliceForfillTestCases";
// import { notValid } from "../@data/storage/storeRx/sliceForValid";
import { useDispatch } from "react-redux";

const useClearChkStateEffect = ({ testCasesData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearCases());
  }, [testCasesData, dispatch]);
};

export default useClearChkStateEffect;
