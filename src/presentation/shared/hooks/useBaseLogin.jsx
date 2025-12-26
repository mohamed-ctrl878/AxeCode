import {
  ValidationError,
  validationLog,
} from "@core/utils/validationFroms/validationLog";
import AuthLoginbase from "@data/repositories/userImps/LoginImp";
import { logIn } from "@data/storage/storeRx/globalStore/userAuthSlice";
import baseLogin from "@domain/usecases/user/baseLoginExe";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useBaseLogin = ({
  identifier,
  password,
  recaptchaToken,
  setError,
  setCaptchaToken,
  capatchaRef,
}) => {
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  const nav = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setError("");
    try {
      validationLog({ identifier, password });
      const data = await baseLogin(new AuthLoginbase(), {
        identifier,
        password,
        recaptchaToken,
      });

      data && dispatch(logIn());
      nav("/settings/profile");
    } catch (err) {
      if (err instanceof ValidationError) {
        err.details.forEach(({ field, message }) => {
          setError(`field: ${field}, Error: ${message}`);
        });
      } else setError(err.toString());
    } finally {
      setLoad(false);
      setCaptchaToken("");
      console.log(capatchaRef);
      capatchaRef?.current?.reset();
    }
  };

  return { handleSubmit, load };
};

export default useBaseLogin;
