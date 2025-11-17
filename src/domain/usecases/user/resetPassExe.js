export async function resetPassExe(core, data) {
  const req = await core.postContent(data);
  return req;
}
