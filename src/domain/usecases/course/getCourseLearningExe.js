export async function getCourseLearningExe(core, query) {
  const req = await core.mappingToLearning(query);
  return [true, req];
}
