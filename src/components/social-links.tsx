type SocialIconProps = {
  className?: string;
};

export function InstagramIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon({ className }: SocialIconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M21 9.2c0-1.3-1-2.4-2.3-2.6C17.1 6.3 14.8 6 12 6s-5.1.3-6.7.6C4 6.8 3 7.9 3 9.2v5.6c0 1.3 1 2.4 2.3 2.6 1.6.3 3.9.6 6.7.6s5.1-.3 6.7-.6c1.3-.2 2.3-1.3 2.3-2.6V9.2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m10.3 9.6 4.4 2.4-4.4 2.4V9.6Z" fill="currentColor" />
    </svg>
  );
}

export const socialLinks = [
  ["Instagram", "https://www.instagram.com/almaghreb_al_alim/", InstagramIcon],
  ["YouTube", "https://www.youtube.com/@AlMaghribAl-alim", YouTubeIcon]
] as const;
