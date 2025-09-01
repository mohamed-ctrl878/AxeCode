import { stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import { handelChangeValueBasic } from "@core/utils/problemUploader/handellers";
import useParsingExe from "@presentation/shared/hooks/useParsingExe";
import React, { useState } from "react";

import { useDispatch, useStore } from "react-redux";

const InputTstCase = ({
  testCasesData,
  setTestCasesData,
  typeOfParams,
  idx,
  style,
  setSatesOftstCases,
  value,
}) => {
  const [err, setErr] = useState("");
  const [elChange, setElChange] = useState("");
  const store = useStore();
  const dispatch = useDispatch();

  // const valid = store.getState().sliceForValid.valid;
  // console.log(valid);

  useParsingExe({
    setSatesOftstCases: setSatesOftstCases,
    setTestCasesData: setTestCasesData,
    idx: idx,
    typeOfParams: typeOfParams,
    setErr: setErr,
    elChange: elChange,
  });

  return (
    <div className={style.containerVector}>
      <div className={style.isolater}>
        <label className={style.inputLabel}>Test Case Input Value</label>
        <span className={style.typeSpan}>{typeOfParams}</span>
      </div>
      <input
        type="text"
        onChange={(el) => {
          setElChange(handelChangeValueBasic(el));
          dispatch(stop());
        }}
        value={testCasesData}
        className={style.formControl}
        placeholder="Enter input value"
        required=""
      />
      <p className={style.error}>{err}</p>
    </div>
  );
};

export default React.memo(InputTstCase);
