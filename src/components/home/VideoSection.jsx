// import { getVideos } from "@/utils/actions";
import Link from "next/link";
import React from "react";
import AutoPlayVideo from "./AutoPlayVideo";

// `uploaded` is the video an admin uploaded in Website Config -> Videos for this
// spot. `video` is the older YouTube entry, kept as the fallback until a video
// is uploaded.
// const VideoSection = async ({video}) => {
const VideoSection = async ({ video, uploaded }) => {
  // const videos = await getVideos();

  // const videoInfo = {
  //   videoId: "qVzXhG1mf_8", // Demo YouTube video ID
  //   title: "Discover the Latest Trends",
  //   subtitle: "Watch our product highlights in action",
  //   buttonText: "Shop Now",
  // };

  const useUploaded = Boolean(uploaded?.video_url);
  const content = useUploaded ? uploaded : video;

  if (!content) return null;

  return (
    <section className="w-full bg-black">
      <div className="relative w-full overflow-hidden">
        {/* Video Wrapper */}
        <div className="relative w-full aspect-video">
          {/* <iframe
            className="absolute top-0 left-0 w-full h-full"
             src={`https://www.youtube.com/embed/${video?.video_link}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&rel=0&modestbranding=1&playlist=${video?.video_link}`}
            title={video?.title}
            allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen
          /> */}
          {useUploaded ? (
            <AutoPlayVideo
              src={uploaded.video_url}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video?.video_link}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&rel=0&modestbranding=1&playlist=${video?.video_link}`}
              title={video?.title}
              allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Overlay Content - now bottom-left */}
        {/* <div className="absolute inset-0 flex flex-col justify-end items-start bg-black/30 text-left p-4 md:p-12"> */}
        <div className="absolute inset-0 flex flex-col justify-end items-start bg-black/30 text-left p-4 md:p-12 pointer-events-none">
          <div>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-2 space-grotesk">
              {/* {video?.title} */}
              {content?.title}
            </h2>

              {/* <p className="text-white text-lg mb-4 space-grotesk">{video?.description}</p> */}
              <p className="text-white text-lg mb-4 space-grotesk">{content?.description}</p>

            {/* {video?.button_text && (
              <Link
              href={video?.button_link}
                 className=" space-grotesk text-white font-semibold px-4 sm:px-8 py-1.5 sm:py-3
                    rounded-md border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out sm:mt-4
                     text-xs sm:text-lg md:text-xl hover:border-[#3A9E75] hover:bg-[#3A9E75]">
               {video?.button_text}
              </Link>
            )} */}
            {content?.button_text && content?.button_link && (
              <Link
                href={content.button_link}
                className="pointer-events-auto space-grotesk text-white font-semibold px-4 sm:px-8 py-1.5 sm:py-3
                    rounded-md border border-white shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out sm:mt-4
                     text-xs sm:text-lg md:text-xl hover:border-[#3A9E75] hover:bg-[#3A9E75]">
                {content.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
