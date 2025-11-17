export async function basicRegisterExe(core, data) {
  const req = await core.register(data);
  return req;
}
