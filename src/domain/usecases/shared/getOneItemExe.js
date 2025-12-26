export const getOneItemExe = async (core, id, query) => {
  const req = await core.DTOToEntity(id, query);
  return req;
};
