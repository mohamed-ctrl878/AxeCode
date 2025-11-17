export default async function baseLogin(core, propertyes) {
  const mm = await core.login(propertyes);
  return mm;
}
