export const getProblemTypeExe = async (core, query) => {
  return [true, await core.getContent(query)];
};
