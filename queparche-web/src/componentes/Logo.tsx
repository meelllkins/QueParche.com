interface Props {
  tamano?: number;
}

/** Isotipo QueParche: globo de diálogo con degradado neón. */
export function Logo({ tamano = 36 }: Props) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B026FF" />
          <stop offset="50%" stopColor="#FF006E" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#161616" stroke="url(#logo-grad)" strokeWidth="4" />
      <path
        d="M50 24c-14.4 0-26 10.4-26 24 0 7.8 3.9 14.7 10 19.1V78l9.3-6.4c2.1.5 4.4.8 6.7.8 14.4 0 26-10.4 26-24S64.4 24 50 24Z"
        fill="url(#logo-grad)"
      />
      <circle cx="39" cy="48" r="4" fill="#0A0A0A" />
      <circle cx="50" cy="48" r="4" fill="#0A0A0A" />
      <circle cx="61" cy="48" r="4" fill="#0A0A0A" />
    </svg>
  );
}
