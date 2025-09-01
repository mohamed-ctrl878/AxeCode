import React from "react";
import useOptmozationSetter from "./useOptmozationSetter";
import usePaginationContent from "@presentation/shared/hooks/usePaginationContent";

const useOPTAndPGN = ({
  setLoad,
  change,
  prevChange,
  setLastChange,
  start,
  core,
  caseUse,
  setError,
  setSuccess,
  setFail,
  setData,
  query,
  load,
  lastChange,
}) => {
  useOptmozationSetter({ setLoad, change, prevChange, setLastChange });

  usePaginationContent({
    start,
    limit: 10,
    core,
    caseUse,
    setError,
    setLoad,
    setSuccess,
    setFail,
    setData,
    query,
    load,
    filterVal: lastChange,
  });
};

export default useOPTAndPGN;
