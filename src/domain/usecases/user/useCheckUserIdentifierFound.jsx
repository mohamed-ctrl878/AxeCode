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

  useEffect(() => {
    if (start) {
      setLoader(true);
      setError("");
      dispatch(stop());
      (async function () {
        try {
          const toStore = validationRegInfo(data);
          const dataFitch = await core.postContent(query);
          const userNameState = getOutIdintify(
            dataFitch?.data,
            "username",
            data.username
          );
          const emailState = getOutIdintify(
            dataFitch?.data,
            "email",
            data.email
          );
          setCheckUsername(userNameState);
          setCheckEmail(emailState);
          if (emailState) {
            if (userNameState)
              throw "userName and email are selected please choose another";
            throw "email is selected please choose another";
          }

          if (dataFitch?.data.length === 0) {
            dispatch(setRegisterDataStore(toStore));
            dispatch(goFetch());
          }
        } catch (e) {
          dispatch(stop());
          setError(e.toString());
        } finally {
          setLoader(false);
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
