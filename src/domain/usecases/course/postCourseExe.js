export default async function postCourseExe(core, param) {
  try {
    const data = await core.postContent(param);
    return [true, data];
  } catch (m) {
    throw m;
  }
}
