function getVideoDuration(url) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(0);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = () => {
      resolve(0); 
    };
  });
}

export default getVideoDuration;
