import PostProblem from "@data/repositories/problemImps/PostProblem";
import postProblemExe from "@domain/usecases/problem/postProblemExe";
import React, { useEffect } from "react";
// import { PostProblem } from "../../../@data/repositories/problemImps/PostProblem";
// import { postProblemExe } from "../../../@domain/usecases/postProblemExe";

const useUploadProblem = ({ post, sucsses, error }) => {
  useEffect(() => {
    const core = new PostProblem();

    try {
      postProblemExe(core);
    } catch (msg) {
      sucsses("");
      error(msg.message);
    }
  }, [post]);
};

export default useUploadProblem;
