import { toFromData } from "@core/utils/problemUploader/handellers";

export const postCourseExe = async (
  [mediaCore, lessonCore],
  [mediaData, dataLesson]
) => {
  [];
  const dataToSend = await mediaCore.postContent(toFromData(mediaData));
  const PostingLesson = await lessonCore.postContent({
    ...dataLesson,
    video: dataToSend.id,
  });
  return [true, PostingLesson];
};
