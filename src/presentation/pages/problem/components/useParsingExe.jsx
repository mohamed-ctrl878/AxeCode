import { useEffect } from "react";

const useParsingExe = ({
  returnedParamNumber,
  paramsVector,
  setParamsVector,
  setIsParamEmpty,
}) => {
  useEffect(() => {
    if (returnedParamNumber > 0 && returnedParamNumber < paramsVector.length) {
      setParamsVector((prev) => {
        let newVector = [...prev];
        while (newVector.length > returnedParamNumber) {
          newVector.pop();
        }
        return newVector;
      });
    }
    // eslint-disable-next-line
  }, [returnedParamNumber]);

  useEffect(() => {
    if (paramsVector.some((vector) => vector.some((val) => val === ""))) {
      setIsParamEmpty(true);
    } else {
      setIsParamEmpty(false);
    }
    // eslint-disable-next-line
  }, [paramsVector]);
};

export default useParsingExe;
