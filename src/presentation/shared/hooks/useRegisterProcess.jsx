import {
  go,
  goLoader,
  goSuccess,
  stopLoader,
  stopSuccess,
} from "@data/storage/storeRx/sharedSlices/validStarter";
import { basicRegisterExe } from "@domain/usecases/user/basicRegisterExe";
import { useDispatch, useSelector } from "react-redux";

export const useRegisterProcess = () => {
  const dispatch = useDispatch();
  const success = useSelector((s) => s.validStarter.success);

  const executeRegistration = async (core, dto) => {
    dispatch(goLoader());
    try {
      await basicRegisterExe(core, dto);
      dispatch(goSuccess());
    } catch (err) {
      dispatch(stopSuccess());
      throw err;
    } finally {
      dispatch(stopLoader());
    }
  };

  return { success, executeRegistration };
};
