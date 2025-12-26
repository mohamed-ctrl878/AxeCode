export async function getCoursesInfoExe(core, data) {
  const req = await core.mappingToCard(data);
  return req;
}
