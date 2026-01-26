import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import { VideoContent, MuxVideoAsset } from "../../../sanity.types";

// We expand the type to handle the dereferenced asset from GROQ.
// Partial<MuxVideoAsset> solves the "missing _id, _createdAt" errors.
export type VideoContentExpanded = Omit<VideoContent, "video"> & {
  video?: {
    asset?: Partial<MuxVideoAsset> & {
      playbackId?: string;
    };
  };
};

interface VideoPlayerProps {
  videoData: VideoContentExpanded;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoData, className }) => {
  const playbackId = videoData.video?.asset?.playbackId;

  if (!playbackId) {
    return (
      <div className="p-4 bg-gray-100 text-gray-400 rounded-lg italic">
        Video asset not found or still processing.
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl shadow-lg ${className}`}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_id: videoData._id,
          video_title: videoData.title || "Portfolio Video",
        }}
        streamType="on-demand"
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        className="w-full aspect-video"
      />
      {videoData.title && (
        <p className="mt-3 text-sm font-medium text-gray-700">
          {videoData.title}
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
