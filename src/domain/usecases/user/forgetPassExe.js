export async function forgetPassExe(core, data) {
  return await core.postContent(data);
}
