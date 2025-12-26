import AuthLogoutBase from "@data/repositories/userImps/Logout";
import { logOut } from "@data/storage/storeRx/globalStore/userAuthSlice";
import { clearData } from "@data/storage/storeRx/globalStore/userData";
import { logoutExe } from "@domain/usecases/user/logoutExe";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useLogout = (setProfile) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    await logoutExe(new AuthLogoutBase());
    dispatch(clearData());
    dispatch(logOut());
    setProfile(false);
    nav("/login");
  };

  return { logout };
};

export default useLogout;
