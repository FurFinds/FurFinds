export type SocialPlatform = "facebook" | "instagram" | "x" | "youtube";

const paths: Record<SocialPlatform, React.ReactNode> = {
  facebook: (
    <path
      d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.6-1.5H16.5V4.3C16.2 4.26 15.2 4.17 14.1 4.17c-2.3 0-3.9 1.4-3.9 4V10.5H7.7v3h2.5V21h3.3z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3.5" />
      <path d="M10.5 9.8v4.4l4-2.2z" fill="currentColor" stroke="none" />
    </>
  ),
};

export function SocialIcon({
  platform,
  size = 18,
  className = "",
}: {
  platform: SocialPlatform;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden="true"
    >
      {paths[platform]}
    </svg>
  );
}
