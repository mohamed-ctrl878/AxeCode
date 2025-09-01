import AuthLoginbase from "@data/repositories/userImps/LoginImp";

export default async function baseLogin(propertyes) {
  const mm = await new AuthLoginbase().login(propertyes);
  return mm;
}
