import { PostMedia } from "@data/repositories/media/PostMedia";

export const postEventExe = async (core, params) => {
    console.log(params)
    const media = await  new PostMedia().postContent(params, "image")
    console.log(media)
    const data = await core.postContent(params);
    return data
};