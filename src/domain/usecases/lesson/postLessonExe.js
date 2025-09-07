import { toFromData } from "@core/utils/problemUploader/handellers";

export const postLessonExe = async (
  mediaCore,
  mediaData,
  lessonCore,
  dataLesson
) => {
  const dataToSend = await mediaCore.postContent(toFromData(mediaData));
  const PostingLesson = await lessonCore.postContent({
    ...dataLesson,
    video: dataToSend.id,
  });
  return [true, PostingLesson];
};
