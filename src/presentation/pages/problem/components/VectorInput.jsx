import React from "react";
import { useSelector } from "react-redux";
// import { validStarter } from "@store/validStarter";

const VectorInput = ({
  vectorLength,
  setVector,
  vector,
  testCaseIndex,
  type,
  exe,
  setIsDeepEmpty,
}) => {
  const isError = useSelector((state) => state.validStarter.start);

  const inputHandler = (e) => {
    let value = e.target.value;
    value = type === "number" ? +value : value;
    setVector((prev) => {
      let newVector = [...prev];
      newVector[testCaseIndex] = value;
      return newVector;
    });
  };

  React.useEffect(() => {
    if (vector.length < vectorLength) {
      setVector((prev) => {
        let newVector = [...prev];
        while (newVector.length < vectorLength) {
          newVector.push(type === "number" ? 0 : "");
        }
        return newVector;
      });
    }
    // eslint-disable-next-line
  }, [vectorLength]);

  React.useEffect(() => {
    if (vector.some((val) => val === "")) {
      setIsDeepEmpty(true);
    } else {
      setIsDeepEmpty(false);
    }
    // eslint-disable-next-line
  }, [vector]);

  return (
    <div className="mt-2">
      <input
        className={`block w-full rounded-lg border  p-2.5 text-sm  dark:bg-gray-700 dark:placeholder-gray-400  ${
          isError
            ? "border-red-500  bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500  dark:text-red-500"
            : "border-gray-300  bg-gray-50 text-gray-900  focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white"
        }`}
        onChange={inputHandler}
        value={vector[testCaseIndex]}
        type={type}
      />
    </div>
  );
};

export default React.memo(VectorInput);
