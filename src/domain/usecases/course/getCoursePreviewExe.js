export async function getCoursePreviewExe(core, query) {
  const req = await core.mappingToPreview(query);
  return [true, req];
}
