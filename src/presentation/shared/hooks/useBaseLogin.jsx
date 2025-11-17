import {
  ValidationError,
  validationLog,
} from "@core/utils/validationFroms/validationLog";
import AuthLoginbase from "@data/repositories/userImps/LoginImp";
import { logIn } from "@data/storage/storeRx/globalStore/userAuthSlice";
import baseLogin from "@domain/usecases/user/baseLoginExe";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useBaseLogin = ({ identifier, password, recaptchaToken, setError }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      }
    }
  };

  return { handleSubmit };
};

export default useBaseLogin;
