import React, { useEffect } from "react";
// import { PostProblem } from "../@data/repositories/problemImps/PostProblem";
// import { ProblemChangesDTO } from "../@data/models/problemDTOs/ProblemUploadDTO";
// import { postProblemExe } from "../@domain/usecases/postProblemExe";

const useActionHook = ({
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
    console.log("dataDTO in useActionHook", dataDTO);
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

export default useActionHook;
