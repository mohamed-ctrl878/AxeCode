import { toFormData } from "@core/utils/problemUploader/handellers";
import { PostMedia } from "@data/repositories/media/PostMedia";

export const postCourseExe = async (core, dataLesson) => {
  const dataToSend = await new PostMedia().postContent(dataLesson, "image");
  // new PostCourses == core
  const PostingLesson = await core.postContent({
    ...dataLesson,
    video: dataToSend.id,
  });
  return [true, PostingLesson];
};