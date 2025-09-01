import { handelChangeListnerTsts } from "@core/utils/problemUploader/handellers";
import InputTstCase from "@presentation/pages/problem/components/InputTstCase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const VectorInput = ({
  setTestCasesData,
  type,
  idxOfparam,
  idxOfTestCase,
  style,
  setSatesOftstCases,
}) => {
  const [arrofcases, setArrOfCases] = useState([""]);
  const [arrofcasesStates, setArrOfCasesStates] = useState([false]);
  // console.log(arrofcasesStates);
  // console.log(arrofcases);
  useEffect(() => {
    setTestCasesData((tstsCase) =>
      handelChangeListnerTsts(tstsCase, idxOfparam, arrofcases)
    );
    setSatesOftstCases((tstsCase) =>
      handelChangeListnerTsts(tstsCase, idxOfparam, arrofcasesStates)
    );
  }, [arrofcases, arrofcasesStates]);
  const fakeInput = Array(arrofcases.length).fill("");
  return (
    <div className={style.arrayPopup}>
      {fakeInput.map((e, i) => {
        return (
          <InputTstCase
            setSatesOftstCases={setArrOfCasesStates}
            key={i}
            idx={i}
            setTestCasesData={setArrOfCases}
            typeOfParams={type}
            testCasesData={arrofcases[i]}
            style={style}
          ></InputTstCase>
        );
      })}

      <button
        onClick={() => {
          setArrOfCases((e) => [...e, ""]);
          setArrOfCasesStates((e) => [...e, false]);
        }}
        type="button"
        className={`${style.btn} ${style.btnSecondary}`}
      >
        add another
      </button>
    </div>
  );
};

export default React.memo(VectorInput);
