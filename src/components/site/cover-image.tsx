/** Renders a campaign/event/post's uploaded image, or a plain placeholder
 * when none has been uploaded yet. Plain <img>, not next/image — the storage
 * host varies by environment (MinIO locally, R2 in production) and isn't
 * worth pinning down via remotePatterns yet. */
export function CoverImage({
  src,
  alt = "",
  className = "aspect-video w-full",
}: {
  src: string | null;
  alt?: string;
  className?: string;
}) {
  if (!src) {
    return <div className={`${className} bg-muted`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`${className} object-cover`} />
  );
}
