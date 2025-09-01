 export default async function postProblemExe(core, params) {
  try {
    const getData = await core.postContent(params);
    // console.log("getData",getData)  
    return [true,getData];
  } catch (msg) {
    throw msg;
  }
}
