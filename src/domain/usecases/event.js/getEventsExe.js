export const getEventsExe = async (repo, query) => {
  return await repo.getEvents(query);
};
