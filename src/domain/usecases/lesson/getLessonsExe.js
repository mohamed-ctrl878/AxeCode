export default async function getLessonsExe(core, query) {
  const data = await core.getContent(query);
  return [true, data];
}
