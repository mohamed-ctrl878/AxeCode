 export default async function postLessonExe(core, params) {
  try {
    // console.log(params);
    const getData = await core.postContent(params);
    // console.log("getData",getData)
    return [true, getData];
  } catch (msg) {
    throw msg;
  }
}
