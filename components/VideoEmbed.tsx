type VideoEmbedProps = {
  videoType: "youtube" | "vimeo" | "local";
  videoUrl: string;
  title: string;
};

function toYoutubeEmbed(url: string): string {
  const idMatch = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  const videoId = idMatch?.[1];
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
}

function toVimeoEmbed(url: string): string {
  const idMatch = url.match(/vimeo\.com\/(\d+)/);
  const videoId = idMatch?.[1];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}

export function VideoEmbed({ videoType, videoUrl, title }: VideoEmbedProps): React.JSX.Element {
  if (videoType === "local") {
    return (
      <div className="border-border/70 relative w-full overflow-hidden rounded-lg border bg-black">
        <video
          className="h-full w-full"
          controls
          preload="none"
          playsInline
          aria-label={title}
          src={videoUrl}
        />
      </div>
    );
  }

  const embedUrl = videoType === "youtube" ? toYoutubeEmbed(videoUrl) : toVimeoEmbed(videoUrl);

  return (
    <div className="border-border/70 relative w-full overflow-hidden rounded-lg border bg-black">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="aspect-video h-full w-full"
      />
    </div>
  );
}
