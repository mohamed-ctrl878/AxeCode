import { basicFilterationQuery } from "@core/queries/basicFilterationQuery";
import React, { useEffect } from "react";
// import { basicFilterationQuery } from "../queries/basicFilterationQuery";

const usePaginationContent = ({
  start,
  limit,
  core,
  caseUse,
  setError,
  setLoad,
  setSuccess,
  setFail,
  setData,
  query,
  filterVal,
}) => {
  useEffect(() => {
    const action = async () => {
      setLoad(true);
      setSuccess(false);
      setFail(false);
      setError("");
      try {
        const [state, data] = await caseUse(
          new core(),
          basicFilterationQuery({
            ...query,
            filterVal: filterVal,
            start: start,
            limit: limit,
          })
        );
        setSuccess(state);
        setData(data);
        setLoad(false);
      } catch (msg) {
        setLoad(false);
        setFail(true);
        setError(msg.message);
      }
    };
    filterVal.length && action();
    setLoad(false);
  }, [filterVal]);
};

export default usePaginationContent;
