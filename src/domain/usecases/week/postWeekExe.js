export const postWeekExe = async (core, params) => {
  const data = await core.postContent(params);
  return [true, data];
};
