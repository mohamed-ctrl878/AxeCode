export const searchUserExe = async (repo, username) => {
  return await repo.searchByUsername(username);
};
