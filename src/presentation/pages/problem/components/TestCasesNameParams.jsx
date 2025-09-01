import React from "react";
import { useSelector } from "react-redux";

const TestCasesNameParams = ({ style }) => {
  const numperOfParams = useSelector(
    (state) => state.DataPostProblem.numperOfParams
  );

  const fakeNumParamsForSetNameOfParams = Array(numperOfParams).fill(0);

  return fakeNumParamsForSetNameOfParams.map((e, id) => (
    <div key={id} className={style.inputItem}>
      <label className={style.formLabel}>Test Case {1} Input Name</label>
      <input
        type="text"
        className={style.formControl}
        placeholder="Enter input name"
        required=""
      />
    </div>
  ));
};

export default React.memo(TestCasesNameParams);
