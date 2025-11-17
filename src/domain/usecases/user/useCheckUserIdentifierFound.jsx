import { querySearchingUserIdintify } from "@core/queries/checkNameAndEmailUsed";
import { getOutIdintify } from "@core/utils/userhelpers/getOutIdintifires";
import { validationRegInfo } from "@core/utils/validationFroms/validationReg";
import { setRegisterDataStore } from "@data/storage/storeRx/globalStore/registerDataSteps";
import { goFetch, stop } from "@data/storage/storeRx/sharedSlices/validStarter";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useCheckUserIdentifierFound = ({
  core,
  data,
  setCheckUsername,
  setCheckEmail,
  setError,
  setLoader,
}) => {
  const dispatch = useDispatch();

  const start = useSelector((state) => state.validStarter.start);
  const query = querySearchingUserIdintify(data);
  console.log("fire");

  useEffect(() => {
    console.log(start);
    if (start) {
      dispatch(stop());
      (async function () {
        try {
          const toStore = validationRegInfo(data);
          const dataFitch = await core.postContent(query);
          setCheckUsername(
            getOutIdintify(dataFitch?.data, "username", data.username)
          );
          setCheckEmail(getOutIdintify(dataFitch?.data, "email", data.email));

          if (dataFitch?.data.length === 0) {
            dispatch(setRegisterDataStore(toStore));
            dispatch(goFetch());
          }
        } catch (e) {
          dispatch(stop());
          setError(e);
          console.log(e);
        }
      })();
    }
  }, [
    start,
    data,
    core,
    setCheckEmail,
    setCheckUsername,
    dispatch,
    query,
    setError,
  ]);
};

export default useCheckUserIdentifierFound;
