import React from "react";
// import CrudTstCases from "./CrudTstCases";
import { useSelector, useStore } from "react-redux";
import CrudTstCases from "./CrudTstCases";

const TestDetails = ({ style }) => {
  const numperOfTstCases = useSelector(
    (state) => state.DataPostProblem.numperOfTstCases
  );

  const fakeArr = Array(numperOfTstCases).fill("");
  return fakeArr.map((e, i) => {
    return (
      <>
        <CrudTstCases idx={i} style={style}></CrudTstCases>
        <div key={i} className={style.testCaseItem}>
          <div>
            <label className={style.formLabel}>
              Test Case {i + 1} Expected Output
            </label>
            <input
              type="text"
              className={style.formControl}
              placeholder="Enter expected output"
              required=""
            />
          </div>
        </div>
      </>
    );
  });
};

export default React.memo(TestDetails);
