import React, { useCallback, useEffect, useState } from "react";

const useGetContent = ({ caseUse }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);

  const getData = useCallback(async () => {
    const reqData = await caseUse();
    console.log(reqData);
    setData(reqData);
  }, [caseUse]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoad(true);
        await getData();
      } catch (e) {
        console.log(e);
        setError(e.toString());
      } finally {
        setLoad(false);
      }
    };

    fetch();
  }, []);

  return { data, error, load };
};

export default useGetContent;
