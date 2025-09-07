import React, { useEffect } from "react";

const useUploadRelatedMedia = ({
  loader,
  setLoader,
  setSuccess,
  subRef,
  caseUse,
  core,
  dataDTO,
  setError,
  setFail,
}) => {
  useEffect(() => {
    // console.log("dataDTO in useActionHook", dataDTO);
    if (subRef?.current && !loader) {
      const action = async (e) => {
        e.preventDefault();
        setFail(false);
        setError("");
        setLoader(true);
        setSuccess(false);
        try {
          const [state, data] = await caseUse(core, dataDTO);
          setLoader(!state);
          setSuccess(state);
        } catch (msg) {
          setLoader(false);
          setError(msg.message);
          setFail(true);
        }
      };

      subRef?.current.addEventListener("click", action);

      return () => {
        if (subRef.current)
          subRef?.current.removeEventListener("click", action);
      };
    }
  }, [
    loader,
    setLoader,
    setFail,
    setError,
    setSuccess,
    subRef,
    caseUse,
    core,
    dataDTO,
  ]);
};

export default useUploadRelatedMedia;
