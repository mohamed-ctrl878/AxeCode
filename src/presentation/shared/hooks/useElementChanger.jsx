import React from "react";

const useElementChanger = ({ setArrOfCases, i, change }) => {
  setArrOfCases((es) => {
    const filt = es.map((f, ids) => {
      if (ids == i) return change.target.value;
      else return f;
    });
    return filt;
  });
};

export default useElementChanger;
