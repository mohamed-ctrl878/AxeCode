import { RegesterConfirm } from "@data/repositories/userImps/RegesterConfirm";
import { useEmailConfirmation } from "@domain/usecases/user/useEmailConfirmation";
import React from "react";
import { useSearchParams } from "react-router-dom";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("confirmation");
  const { loading, error, data } = useEmailConfirmation(
    new RegesterConfirm(),
    code
  );
  return (
    // loader here<
    <></>
  );
};

export default EmailConfirmation;
