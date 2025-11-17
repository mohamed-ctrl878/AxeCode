import { toFormData } from "@core/utils/problemUploader/handellers";
import { PostMedia } from "@data/repositories/media/PostMedia";
import { get } from "idb-keyval";

export const postLessonExe = async (core, dataLesson) => {
  const dataToSend = await new PostMedia().postContent(dataLesson, "video");
  const PostingLesson = await core.postContent({
    ...dataLesson,
    video: dataToSend.id,
  });
  return [true, PostingLesson];
};
