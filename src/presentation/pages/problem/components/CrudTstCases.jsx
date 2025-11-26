import useClearChkStateEffect from "@presentation/shared/hooks/useClearChkStateEffect";
import useFillTestCasesEffect from "@presentation/shared/hooks/useFillTestCasesEffect";
import { toWords } from "number-to-words";
import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import InputTstCase from "./InputTstCase";
import VectorInput from "@presentation/shared/components/form/VectorInput";
import { intValid } from "@core/utils/problemUploader/validation";

const CrudTstCases = ({ idx, style }) => {
  const store = useStore();
  const testCases = store.getState().DataPostProblem.testCases;
  const testCasesStates = store.getState().DataPostProblem.testCasesStates;

  const typeOfParams = useSelector(
    (state) => state.DataPostProblem.typeOfParams
  );

  const numToword = toWords(idx + 1);
  const [testCasesData, setTestCasesData] = useState([...testCases[idx]]);
  const [statesOftstCases, setSatesOftstCases] = useState([
    ...testCasesStates[idx],
  ]);

  useFillTestCasesEffect({
    idx: idx,
    testCasesData: testCasesData,
    statesOftstCases: statesOftstCases,
  });
  useClearChkStateEffect({
    testCasesData: testCasesData,
  });

  return (
    <div className={style.testCaseSection}>
      <h2 className={style.testCaseTitle}>{numToword} - test casse</h2>
      {testCasesData.map((e, i) => {
        return (
          <div key={i} className={style.testCaseItem}>
            {typeOfParams[i].includes("vector") ? (
              <VectorInput
                setTestCasesData={setTestCasesData}
                setSatesOftstCases={setSatesOftstCases}
                idxOfparam={i}
                idxOfTestCase={idx}
                type={typeOfParams[i]}
                style={style}
              ></VectorInput>
            ) : (
              <InputTstCase
                idx={i}
                setTestCasesData={setTestCasesData}
                setSatesOftstCases={setSatesOftstCases}
                typeOfParams={typeOfParams[i]}
                testCasesData={testCasesData[i]}
                style={style}
              ></InputTstCase>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(CrudTstCases);
