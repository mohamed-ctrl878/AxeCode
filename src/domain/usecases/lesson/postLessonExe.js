import { toFormData } from "@core/utils/problemUploader/handellers";
import { PostMedia } from "@data/repositories/media/PostMedia";

export const postLessonExe = async (core, dataLesson) => {
  console.log("dataLesson", dataLesson);
  const dataToSend = await new PostMedia().postContent(
    toFormData(dataLesson.video)
  );
  const PostingLesson = await core.postContent({
    ...dataLesson,
    video: dataToSend.id,
  });
  return [true, PostingLesson];
};
