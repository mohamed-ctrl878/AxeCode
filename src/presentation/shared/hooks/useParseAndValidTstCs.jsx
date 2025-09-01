import React, { useEffect } from "react";

const useParseAndValidTstCs = ({testCases}) => {
  useEffect(() => {
      const validation = () => {
        try {
          const parsingOperate = testCases.map((e) => {
            // return executionValidType(type, e);
          });
        } catch (m) {
          console.log(m);
        }
      };
  }, []);
};

export default useParseAndValidTstCs;
