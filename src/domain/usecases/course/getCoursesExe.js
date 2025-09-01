 export default async function getCoursesExe(core, query) {
  const data = await core.getContent(query);
  return [true, data];
}
