import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { s?: number };

export const IFlame = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.11-3.66 5.65-2.7 8.87.06.22.12.44.12.67 0 .44-.36.82-.8.82-.42 0-.72-.27-.83-.65-.03-.1-.06-.2-.08-.31-1.14 1.6-1.33 3.75-.55 5.56.53 1.22 1.39 2.28 2.45 3.04.98.71 2.09 1.21 3.26 1.41.33.06.66.1.99.1 1.23.04 2.44-.26 3.47-.86 2.01-1.14 3.36-3.28 3.36-5.68 0-1.32-.43-2.57-1.14-3.6z" />
  </svg>
);
export const ILeaf = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c7 0 13-5 13-12-3 0-7 1-11 4l3.17 3.17A4.98 4.98 0 0119 16c0 3.31-1.58 6.25-4 8.1A11.97 11.97 0 0017 8z" />
  </svg>
);
export const IStar = ({ s = 16, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
export const IPin = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
export const IPhone = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);
export const IMail = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
export const IBag = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
  </svg>
);
export const IArrow = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
export const IPlus = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
export const IClock = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);
export const IChef = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" />
  </svg>
);
export const ICheck = ({ s = 16, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);
export const IMenu = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
export const IGlobe = ({ s = 20, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.9 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.66-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
  </svg>
);
export const ISparkle = ({ s = 14, ...p }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z" />
  </svg>
);
