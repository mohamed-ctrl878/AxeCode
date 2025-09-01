// import { getMyData } from "../../@data/repositories/GetMyData";

export default async function userAuth(core) {
  const getFitching = await core.getMyData();
  return getFitching;
}
