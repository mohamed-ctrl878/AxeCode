export default async function postProblemExe(core, params) {
  const getData = await core.postContent(params);
  // console.log("getData",getData)
  return [true, getData];
}
