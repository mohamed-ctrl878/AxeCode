import { ForgetPasswordClass } from "@data/repositories/userImps/ForgetPasswordClass";
import { forgetPassExe } from "@domain/usecases/user/forgetPassExe";
import React from "react";

const useForgetPass = ({
  exeuter,
  dataModel,
  setError,
  setSuccess,
  core,
  fireOnSuccess,
}) => {
  return async (e) => {
    try {
      e.preventDefault();
      const data = await exeuter(core, dataModel);
      setSuccess(data?.message || "please check you inbox");
      setError("");
      if (fireOnSuccess) {
        fireOnSuccess();
      }
    } catch (m) {
      setSuccess("");
      setError(m);
    }
  };
};

export default useForgetPass;
