import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: ['/', '/(fr|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
// };

export default createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
});

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};