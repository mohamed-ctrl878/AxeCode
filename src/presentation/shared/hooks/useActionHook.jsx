import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useActionHook = ({
  loader,
  setLoader,
  setSuccess,
  subRef,
  caseUse,
  core,
  dataDTO,
  setError,
  setFail,
  removeData,
  success,
}) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const time = useRef();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => nav("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, nav]);

  const action = useCallback(
    async (e) => {
      e.preventDefault();
      setFail(false);
      setError("");
      setLoader(true);
      setSuccess(false);

      try {
        const [state, data] = await caseUse(core, dataDTO);
        setLoader(!state);
        setSuccess(state);
        dispatch(removeData());
      } catch (msg) {
        setLoader(false);
        setError(msg.message);
        setFail(true);
      }
    },
    [
      caseUse,
      core,
      dataDTO,
      dispatch,
      setFail,
      setError,
      setLoader,
      setSuccess,
      removeData,
    ]
  );

  useEffect(() => {
    const el = subRef?.current;
    if (!el) return;
    if (success) return;

    el.addEventListener("click", action);

    return () => {
      el.removeEventListener("click", action);
      // if (time.current) clearTimeout(time.current);
    };
  }, [subRef, action]);
};

export default useActionHook;
