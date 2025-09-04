export const getCourseTypeExe = async (core, query) => {
  return [true, await core.getContent(query)];
};
